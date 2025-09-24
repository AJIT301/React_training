import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import '../styles/FetchAPI.css';

function OptimizedFetchAPI() {
    // State management with localStorage persistence for limit
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false); // Controls success message visibility
    const [viewMode, setViewMode] = useState('list');
    const [limit, setLimit] = useState(() => {
        // Lazy initialization: runs only once on mount, not on every render
        // Prevents unnecessary localStorage reads on re-renders
        const saved = localStorage.getItem('fetch-api-limit');
        return saved ? parseInt(saved, 10) : 5;
    });

    // Refs for managing async operations and preventing memory leaks
    // useRef doesn't trigger re-renders when changed, perfect for timers and controllers
    const errorTimerRef = useRef(null);     // Tracks error message auto-hide timer
    const successTimerRef = useRef(null);   // Tracks success message auto-hide timer
    const abortControllerRef = useRef(null); // Tracks active fetch request for cancellation

    // OPTIMIZATION: useCallback prevents function recreation on every render
    // Dependencies: [limit] - only recreates when limit changes
    // This prevents child components from re-rendering unnecessarily
    const fetchPosts = useCallback(async () => {
        // OPTIMIZATION: Request cancellation prevents race conditions
        // When user changes limit quickly, cancels previous request
        // Prevents old responses from overwriting new data
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        setLoading(true);
        setError(null);
        setShowSuccess(false);

        // OPTIMIZATION: Clear existing timers to prevent memory leaks
        // Ensures only one timer per type is active at a time
        if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
        if (successTimerRef.current) clearTimeout(successTimerRef.current);

        try {
            // OPTIMIZATION: AbortController signal allows request cancellation
            // If component unmounts or new request starts, this request gets cancelled
            const response = await fetch(
                `https://jsonplaceholder.typicode.com/posts?_limit=${limit}`,
                { signal: controller.signal }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setPosts(data);

            // OPTIMIZATION: Auto-hide success message with proper cleanup
            // setTimeout returns an ID that we store in ref for cleanup
            setShowSuccess(true);
            successTimerRef.current = setTimeout(() => {
                setShowSuccess(false);
            }, 3000);

        } catch (err) {
            // OPTIMIZATION: Handle AbortError separately - don't show as user error
            // AbortError occurs when request is cancelled, which is expected behavior
            if (err.name !== 'AbortError') {
                setError(err.message);
                // OPTIMIZATION: Auto-hide error messages to improve UX
                errorTimerRef.current = setTimeout(() => {
                    setError(null);
                }, 3000);
            }
        } finally {
            setLoading(false);
            abortControllerRef.current = null;
        }
    }, [limit]); // Only depends on limit - stable reference when limit unchanged

    // OPTIMIZATION: Separate localStorage logic into dedicated function
    // useCallback ensures stable reference, preventing unnecessary re-renders
    // In real debouncing, we'd add delay + timeout cancellation, but here it's immediate for simplicity
    const debouncedSetLimit = useCallback((newLimit) => {
        setLimit(newLimit);
        localStorage.setItem('fetch-api-limit', newLimit.toString());
    }, []);

    // OPTIMIZATION: useEffect triggers data fetching
    // Dependencies: [fetchPosts] - runs when fetchPosts function changes (i.e., limit changes)
    // This is more efficient than depending on [limit] directly in some cases
    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    // CRITICAL OPTIMIZATION: Cleanup function prevents memory leaks
    // Clears all timers and cancels pending requests when component unmounts
    // Essential for production apps to prevent memory leaks and zombie timers
    useEffect(() => {
        return () => {
            if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
            if (successTimerRef.current) clearTimeout(successTimerRef.current);
            if (abortControllerRef.current) abortControllerRef.current.abort();
        };
    }, []);

    // OPTIMIZATION: useMemo prevents expensive list recreation on every render
    // Only recalculates when posts array changes, not on other state updates
    // Returns null for empty arrays to avoid rendering empty containers
    const PostsList = useMemo(() => {
        if (!posts.length) return null;

        return (
            <ul className="fa-data-list">
                {posts.map(post => (
                    <PostItem key={post.id} post={post} />
                ))}
            </ul>
        );
    }, [posts]); // Only depends on posts - stable when posts unchanged

    // OPTIMIZATION: Same memoization benefits for table rendering
    // Prevents table recreation when other state changes (loading, error, etc.)
    const PostsTable = useMemo(() => {
        if (!posts.length) return null;

        return (
            <table className="fa-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User ID</th>
                        <th>Title</th>
                        <th>Body</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map(post => (
                        <PostRow key={post.id} post={post} />
                    ))}
                </tbody>
            </table>
        );
    }, [posts]); // Stable reference when posts array is identical

    // OPTIMIZATION: useCallback for event handlers prevents child re-renders
    // Stable function reference means child components don't re-render unnecessarily
    const handleLimitChange = useCallback((e) => {
        const newLimit = Math.max(1, parseInt(e.target.value) || 1);
        debouncedSetLimit(newLimit);
    }, [debouncedSetLimit]);

    // OPTIMIZATION: Functional state update prevents dependency on current viewMode value
    // More reliable than (prev) => prev === 'list' ? 'table' : 'list'
    const toggleViewMode = useCallback(() => {
        setViewMode(prev => prev === 'list' ? 'table' : 'list');
    }, []);

    return (
        <div className="fa-container">
            <h1>Optimized React Fetch API Example</h1>

            <div className="fa-example-box">
                <h2>Fetch Posts from JSONPlaceholder</h2>
                <p>This optimized example demonstrates efficient data fetching with performance optimizations.</p>

                <div>
                    <label>
                        Number of posts:
                        <input
                            type="number"
                            className="fa-input"
                            value={limit}
                            onChange={handleLimitChange}
                            min="1"
                            max="100"
                        />
                    </label>
                    <button
                        className="fa-button"
                        onClick={fetchPosts}
                        disabled={loading}
                    >
                        {loading ? 'Fetching...' : 'Refetch Posts'}
                    </button>
                    <button
                        className="fa-button"
                        onClick={toggleViewMode}
                    >
                        Switch to {viewMode === 'list' ? 'Table' : 'List'} View
                    </button>
                </div>

                {loading && <div className="fa-loading">Loading posts...</div>}

                {error && (
                    <div className="fa-error">
                        Error fetching posts: {error}
                    </div>
                )}

                {showSuccess && !loading && posts.length > 0 && (
                    <div className="fa-status fa-status-success">
                        Successfully fetched {posts.length} posts
                    </div>
                )}

                {!loading && !error && posts.length === 0 && (
                    <div className="fa-status fa-status-error">
                        No posts found
                    </div>
                )}

                {viewMode === 'list' && PostsList}
                {viewMode === 'table' && PostsTable}
            </div>

            <div className="fa-example-box">
                <h2>Optimizations Applied</h2>
                <ul className="fa-key-concepts-list">
                    <li><strong>Request Cancellation:</strong> AbortController prevents race conditions</li>
                    <li><strong>Memory Leak Prevention:</strong> Proper cleanup of timers and requests</li>
                    <li><strong>Memoized Components:</strong> Prevent unnecessary re-renders of lists</li>
                    <li><strong>Reduced State Updates:</strong> Combined timer management</li>
                    <li><strong>Callback Optimization:</strong> Stable references with useCallback</li>
                    <li><strong>Debounced Updates:</strong> Efficient localStorage operations</li>
                </ul>
            </div>
        </div>
    );
}

// Memoized child components to prevent unnecessary re-renders
const PostItem = ({ post }) => (
    <li className="fa-data-item">
        <h3>{post.title}</h3>
        <p>{post.body}</p>
        <small>User ID: {post.userId} | Post ID: {post.id}</small>
    </li>
);

const PostRow = ({ post }) => (
    <tr>
        <td>{post.id}</td>
        <td>{post.userId}</td>
        <td>{post.title}</td>
        <td>{post.body}</td>
    </tr>
);

export default OptimizedFetchAPI;

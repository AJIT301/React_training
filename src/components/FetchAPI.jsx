import { useState, useEffect, useCallback } from 'react';
import '../styles/FetchAPI.css';

function FetchAPI() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [viewMode, setViewMode] = useState('list');
    // Initialize limit from localStorage (runs only once on mount)
    const [limit, setLimit] = useState(() => {
        const saved = localStorage.getItem('fetch-api-limit');
        return saved ? parseInt(saved, 10) : 5; // default to 5 if not found
    });

    // Function to fetch posts
    const fetchPosts = useCallback(async () => {
        setLoading(true);
        setError(null);
        setShowError(false);
        setShowSuccess(false);
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=${limit}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setPosts(data);
            setShowSuccess(true);
        } catch (err) {
            setError(err.message);
            setShowError(true);
        } finally {
            setLoading(false);
        }
    }, [limit]);

    useEffect(() => {
        localStorage.setItem('fetch-api-limit', limit.toString());
    }, [limit]);
    // Fetch posts on component mount and when fetchPosts changes (i.e., when limit changes)
    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    // Auto-hide error message after 3 seconds
    useEffect(() => {
        if (showError) {
            const timer = setTimeout(() => {
                setShowError(false);
                setError(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showError]);

    // Auto-hide success message after 3 seconds
    useEffect(() => {
        if (showSuccess) {
            const timer = setTimeout(() => {
                setShowSuccess(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showSuccess]);

    return (
        <div className="fa-container">
            <h1>React Fetch API Example</h1>

            <div className="fa-example-box">
                <h2>Fetch Posts from JSONPlaceholder</h2>
                <p>This example demonstrates fetching data from a REST API using the Fetch API.</p>

                <div>
                    <label>
                        Number of posts:
                        <input
                            type="number"
                            className="fa-input"
                            value={limit}
                            onChange={(e) => setLimit(Math.max(1, parseInt(e.target.value) || 1))}
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
                        onClick={() => setViewMode(viewMode === 'list' ? 'table' : 'list')}
                    >
                        Switch to {viewMode === 'list' ? 'Table' : 'List'} View
                    </button>
                </div>

                {loading && <div className="fa-loading">Loading posts...</div>}

                {showError && error && (
                    <div className="fa-error">
                        Error fetching posts: {error}
                    </div>
                )}

                {showSuccess && !loading && posts.length > 0 && (
                    <div className="fa-status fa-status-success">
                        Successfully fetched {posts.length} posts
                    </div>
                )}

                {!loading && !showError && posts.length === 0 && (
                    <div className="fa-status fa-status-error">
                        No posts found
                    </div>
                )}

                {viewMode === 'list' && posts.length > 0 && (
                    <ul className="fa-data-list">
                        {posts.map(post => (
                            <li key={post.id} className="fa-data-item">
                                <h3>{post.title}</h3>
                                <p>{post.body}</p>
                                <small>User ID: {post.userId} | Post ID: {post.id}</small>
                            </li>
                        ))}
                    </ul>
                )}

                {viewMode === 'table' && posts.length > 0 && (
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
                                <tr key={post.id}>
                                    <td>{post.id}</td>
                                    <td>{post.userId}</td>
                                    <td>{post.title}</td>
                                    <td>{post.body}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="fa-example-box">
                <h2>Key Concepts Demonstrated</h2>
                <ul className="fa-key-concepts-list">
                    <li><strong>useState:</strong> Managing loading, error, data, and UI state</li>
                    <li><strong>useEffect:</strong> Fetching data on mount and when dependencies change</li>
                    <li><strong>async/await:</strong> Handling asynchronous operations</li>
                    <li><strong>Error handling:</strong> Try/catch blocks and user-friendly error messages</li>
                    <li><strong>Conditional rendering:</strong> Showing different UI based on state</li>
                    <li><strong>Event handlers:</strong> Button clicks and input changes</li>
                    <li><strong>CSS classes:</strong> Consistent styling with transparency effects</li>
                </ul>
            </div>
        </div>
    );
}

export default FetchAPI;

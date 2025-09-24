// src/App.jsx
import { useEffect } from 'react';
import NavModal from './components/NavModal.jsx';
import useCompRegistry from './hooks/useCompRegistry.jsx';
import CompComponents from './components/helpers/TaskComponents.js';
import { WidgetProvider } from './components/Assignments/WidgetContext.jsx';
import './App.css';

// ✅ Define all default comps here
const DEFAULT_COMPS = [
  { name: "First comp", type: "First", description: "Your very first component — a simple starter." },
  { name: "Display", type: "Greetings", description: "Learn how to pass props — displays a greeting with a name." },
  { name: "Counter Comp", type: "Comp1", description: "Master useState — click to increment a counter." },
  { name: "useEffect Deep Dive", type: "UseEffect", description: "Master side effects, cleanup, and dependencies." },
  { name: "UseRefComponent", type: "UseRefComponent", description: "Master usage of UseRef hook" },
  { name: "Assignment1", type: "Assignment1", description: "Goal: Build a React page with 3 widgets (boxes in a grid) Each widget has its own toggle switch or control.All states are saved in localStorage. A parent Reset Allbutton can reset all widgets to default by calling each widget’s exposed method via" },
  { name: "FetchAPI", type: "FetchAPI", description: "Master usage of Fetch API" },
  { name: "OptimizedFetchAPI", type: "OptimizedFetchAPI", description: "Master usage of Fetch API and React Optimizations!" }
];


function App() {
  const { comps, registerComp, toggleComp, isLoading } = useCompRegistry();

  useEffect(() => {
    if (!isLoading) {
      const existingNames = new Set(comps.map(comp => comp.name));
      DEFAULT_COMPS.forEach(compDef => {
        if (!existingNames.has(compDef.name)) {
          registerComp(compDef.name, compDef.type, compDef.description);
        }
      });
    }
  }, [comps, registerComp, isLoading]);

  if (isLoading) {
    return <div>Loading your comps...</div>;
  }

  console.log("🚀 Components in App:", comps);
  return (
    <div className="app-container">
      
      {comps.map((comp) => {
        if (!comp.isVisible) return null;

        const Component = CompComponents[comp.type];
        if (!Component) {
          console.error(`❌ Missing component: "${comp.type}". Did you forget to add it to CompComponents.js?`);
          return null;
        }
        // Special case: Greetings needs a prop
        if (comp.type === "Greetings") {
          return <Component key={comp.name} name="Iguana" />;
        }
        // Special case: Assignment1 needs WidgetProvider
        if (comp.type === "Assignment1") {
          return <WidgetProvider key={comp.name}><Component /></WidgetProvider>;
        }
        return <Component key={comp.name} />;
      })}

      <NavModal comps={comps} onToggleComp={toggleComp} />
    </div>
  );
}

export default App;

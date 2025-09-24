import "./Assignment.css";
import Widget from "./Widget";
import { useWidgetContext } from "./WidgetHooks";

function Assignment1() {
    const { resetAllWidgets } = useWidgetContext();

    const handleResetAll = () => {
        resetAllWidgets();
    };

    return (
        <div className="as-container">
            <div className="as-wrapper">
                <Widget
                    widgetId="1"
                    title="Dark Mode"
                    description="Toggle the theme of the application."
                />
                <Widget
                    widgetId="2"
                    title="Notifications"
                    description="Enable or disable push notifications."
                />
                <Widget
                    widgetId="3"
                    title="Auto-Save"
                    description="Automatically save your progress."
                />
            </div>
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
                <button
                    onClick={handleResetAll}
                    className="as-reset-button"
                >
                    Reset All Widgets
                </button>
            </div>
        </div>
    );
}

export default Assignment1;

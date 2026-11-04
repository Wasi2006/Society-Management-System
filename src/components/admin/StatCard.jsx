
function StatCard({ title, value, description, icon, color }) {
    return (
        <div className="stat-card">

            <div className={`stat-icon ${color}`}>
                {icon}
            </div>

            <div className="stat-details">
                <p>{title}</p>
                <h2>{value}</h2>
                <span>{description}</span>
            </div>

        </div>
    );
}

export default StatCard;

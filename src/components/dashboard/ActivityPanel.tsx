import { formatDistanceToNow } from "date-fns";
import type { Activity } from '@/types/api.types'; // Import type from the hook file

interface ActivityPanelProps {
  activities: Activity[];
  isError: boolean; // New prop
}

const ActivityPanel: React.FC<ActivityPanelProps> = ({ activities, isError }) => {

  if (isError) {
    return (
      <div className="rounded-xl bg-white p-4 shadow-md text-center py-4 text-red-500">
        Failed to load activity feed.
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-4 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Activity</h3>
        <button className="text-sm text-orange-500 hover:underline">See all</button>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-4 text-gray-500 text-sm">No recent activity.</div>
      ) : (
        <ul className="space-y-4 max-h-64 overflow-y-auto">
          {activities.map((act) => (
            // Using 'id' from the interface definition is better than 'i' for keys
            <li key={act.id} className="flex items-center gap-3">
              <img src={act.avatar} alt={act.name} className="w-8 h-8 rounded-full object-cover" />
              <div>
                <p className="text-sm">
                  <span className="font-medium">{act.name}</span>{" "}
                  <span className="text-gray-600">{act.action}</span>
                </p>
                <span className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(act.time), { addSuffix: true })}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActivityPanel;
import { useEffect, useState } from "react";
import { mockApi } from "@/services/mockApi";
import { formatDistanceToNow } from "date-fns";

interface Activity {
  name: string;
  action: string;
  time: string; // ISO string
  avatar: string;
}

const ActivityPanel = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockApi.get("activity")
      .then((data: { activities: Activity[] }) => {
        setActivities(data.activities ?? []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load activities:", err);
        setActivities([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-4 text-gray-500">Loading activities…</div>;
  }

  return (
    <div className="rounded-xl bg-white p-4 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Activity</h3>
        <button className="text-sm text-orange-500 hover:underline">See all</button>
      </div>

      <ul className="space-y-4 max-h-64 overflow-y-auto">
        {activities.map((act, i) => (
          <li key={i} className="flex items-center gap-3">
            <img src={act.avatar} alt={act.name} className="w-8 h-8 rounded-full" />
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
    </div>
  );
};

export default ActivityPanel;

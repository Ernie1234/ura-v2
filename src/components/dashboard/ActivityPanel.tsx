// src/components/dashboard/ActivityPanel.tsx
interface Activity {
  name: string;
  action: string;
  time: string;
  avatar: string;
}

const activities: Activity[] = [
  {
    name: 'Jane Cloe',
    action: 'Started following you',
    time: '10m ago',
    avatar: '/images/avatar-female.png',
  },
  {
    name: 'Sam Charles',
    action: 'Liked your photo',
    time: '20m ago',
    avatar: '/images/avatar-male.png',
  },
  {
    name: 'Jeff Ham',
    action: 'Liked your comment',
    time: '45m ago',
    avatar: '/images/avatar-male.png',
  },
];

const ActivityPanel = () => {
  return (
    <div className="rounded-xl bg-white p-4 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Activity</h3>
        <button className="text-sm text-orange-500 hover:underline">See all</button>
      </div>

      <ul className="space-y-4">
        {activities.map((act, i) => (
          <li key={i} className="flex items-center gap-3">
            <img src={act.avatar} alt={act.name} className="w-8 h-8 rounded-full" />
            <div>
              <p className="text-sm">
                <span className="font-medium">{act.name}</span>{' '}
                <span className="text-gray-600">{act.action}</span>
              </p>
              <span className="text-xs text-gray-400">{act.time}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityPanel;

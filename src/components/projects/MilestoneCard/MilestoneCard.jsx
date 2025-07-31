const MilestoneCard = ({ title, date, updated, hasNote }) => (
  <div className="bg-gray-700 p-4 rounded-lg">
    <h3 className="font-bold text-yellow-400">{title}</h3>
    <p className="text-xl my-2">{date}</p>
    {hasNote && (
      <p className="text-sm text-gray-400 italic">Actualizado: {updated}</p>
    )}
  </div>
);
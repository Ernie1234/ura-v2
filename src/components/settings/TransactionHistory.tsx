// src/components/settings/TransactionHistory.tsx
const TransactionHistory = ({ transactions }: { transactions: any[] }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Transactions</h2>
          <p className="text-sm text-gray-500">Manage your earnings and spending.</p>
        </div>
        <button className="text-sm font-bold text-orange-600 hover:underline">Download CSV</button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Description</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50/30 transition-colors">
                <td className="p-4">
                  <p className="text-sm font-bold text-gray-900">{tx.title}</p>
                  <p className="text-xs text-gray-400">{tx.type}</p>
                </td>
                <td className="p-4 text-xs text-gray-500">{tx.date}</td>
                <td className={`p-4 text-sm font-bold text-right ${tx.amount < 0 ? 'text-gray-900' : 'text-green-600'}`}>
                  {tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
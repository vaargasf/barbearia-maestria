export function Table({ children, className = '' }) {
  return (
    <div className={`overflow-x-auto rounded-lg border border-border ${className}`}>
      <table className="w-full text-sm text-left">{children}</table>
    </div>
  )
}

export function TableHead({ children }) {
  return (
    <thead className="bg-secondary text-muted-foreground uppercase text-xs">
      {children}
    </thead>
  )
}

export function TableBody({ children }) {
  return <tbody className="divide-y divide-border">{children}</tbody>
}

export function TableRow({ children, className = '' }) {
  return <tr className={`hover:bg-accent/50 ${className}`}>{children}</tr>
}

export function TableCell({ children, className = '' }) {
  return <td className={`px-4 py-3 ${className}`}>{children}</td>
}

export function TableHeaderCell({ children, className = '' }) {
  return <th className={`px-4 py-3 font-medium ${className}`}>{children}</th>
}

export default function StudentsPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl text-text-high">
        Student Management
      </h1>
      <p className="text-text-muted text-lg">
        Table of all students with search, filter, and bulk actions will be displayed here.
      </p>
    </div>
  );
}

export { StudentsPage as Component };

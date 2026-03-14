import { useParams } from 'react-router';

export default function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl text-text-high">
        Student Detail
      </h1>
      <p className="text-text-muted text-lg">
        Detailed information for student ID: {id}
      </p>
      <p className="text-text-muted">
        Profile, sponsorship history, photos, and edit form will be displayed here.
      </p>
    </div>
  );
}

export { StudentDetailPage as Component };

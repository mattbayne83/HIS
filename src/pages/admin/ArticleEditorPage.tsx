import { useParams } from 'react-router';

export default function ArticleEditorPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl text-text-high">
        {id ? 'Edit Article' : 'New Article'}
      </h1>
      <p className="text-text-muted text-lg">
        {id
          ? `Editing article ID: ${id}`
          : 'Creating a new article or news post'}
      </p>
      <p className="text-text-muted">
        Rich text editor, image upload, metadata fields, and publish controls will be displayed here.
      </p>
    </div>
  );
}

export { ArticleEditorPage as Component };

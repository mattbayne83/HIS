import { useParams } from 'react-router';

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl text-text-high mb-6">
        Article: {slug}
      </h1>
      <p className="text-text-muted text-lg">
        Full article content will be displayed here.
      </p>
    </div>
  );
}

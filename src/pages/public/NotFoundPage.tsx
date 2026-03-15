import { Link } from 'react-router'
import { Helmet } from 'react-helmet-async'
import { Home, ArrowLeft } from 'lucide-react'
import { Button } from '../../components/ui'

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>Page Not Found - Himali Indigenous Services</title>
        <meta name="description" content="The page you're looking for doesn't exist. Return to Himali Indigenous Services homepage." />
      </Helmet>

      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Number */}
          <p className="font-display text-9xl md:text-[12rem] font-bold text-primary/10 mb-8 leading-none">
            404
          </p>

          {/* Message */}
          <h1 className="font-display text-3xl md:text-5xl font-bold text-text-high mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-text-muted mb-8 leading-relaxed max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button variant="primary" className="inline-flex items-center gap-2">
                <Home className="w-4 h-4" />
                Go to Homepage
              </Button>
            </Link>
            <button onClick={() => window.history.back()}>
              <Button variant="outline" className="inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </Button>
            </button>
          </div>

          {/* Help Text */}
          <p className="text-sm text-text-muted mt-12">
            Need help?{' '}
            <a
              href="mailto:info@his-serve.org"
              className="text-primary hover:text-primary-dark underline decoration-primary/30 transition-colors"
            >
              Contact us
            </a>
          </p>
        </div>
      </div>
    </>
  )
}

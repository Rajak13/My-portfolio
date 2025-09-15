import { Layout } from '@/components/layout'

export default function Home() {
  return (
    <Layout.Root>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Multilingual Portfolio
        </h1>
        <p className="text-center text-muted-foreground">
          Welcome to your modern, interactive portfolio website
        </p>
      </div>
    </Layout.Root>
  )
}

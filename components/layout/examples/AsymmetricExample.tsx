import React from 'react'
import { Layout } from '../Layout'

// Example component demonstrating Layout.Asymmetric usage
export const AsymmetricExample: React.FC = () => {
  return (
    <Layout.Asymmetric className="p-6">
      {/* Hero section - spans multiple columns */}
      <div className="lg:col-span-8 lg:col-start-1">
        <div className="bg-primary text-primary-foreground p-8 rounded-lg">
          <h1 className="text-4xl font-bold mb-4">Featured Project</h1>
          <p className="text-lg opacity-90">
            This is an example of asymmetric layout perfect for magazine-style designs.
          </p>
        </div>
      </div>

      {/* Sidebar content */}
      <div className="lg:col-span-4 lg:col-start-9 space-y-6">
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="font-semibold mb-2">Quick Info</h3>
          <p className="text-sm text-muted-foreground">
            Additional information or navigation elements can go here.
          </p>
        </div>
        
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="font-semibold mb-2">Related Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="text-primary hover:underline">Project Gallery</a></li>
            <li><a href="#" className="text-primary hover:underline">Case Study</a></li>
            <li><a href="#" className="text-primary hover:underline">Live Demo</a></li>
          </ul>
        </div>
      </div>

      {/* Content section - different column arrangement */}
      <div className="lg:col-span-7 lg:col-start-2">
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-2xl font-semibold mb-4">Project Details</h2>
          <p className="text-muted-foreground mb-4">
            This asymmetric grid layout creates visual interest and guides the reader&apos;s eye 
            through the content in a non-linear fashion, similar to magazine layouts.
          </p>
          <p className="text-muted-foreground">
            The grid system is responsive and adapts to different screen sizes while 
            maintaining the editorial feel on larger displays.
          </p>
        </div>
      </div>

      {/* Small accent element */}
      <div className="lg:col-span-3 lg:col-start-10">
        <div className="bg-accent p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-accent-foreground">2024</div>
          <div className="text-sm text-muted-foreground">Project Year</div>
        </div>
      </div>
    </Layout.Asymmetric>
  )
}
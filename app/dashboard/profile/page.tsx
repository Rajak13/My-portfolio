'use client'

import { ProfileForm } from '@/components/auth/ProfileForm'
import { useAuth } from '@/lib/providers/AuthProvider'

export default function ProfilePage() {
  const { user, profile } = useAuth()

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Update your profile information and preferences
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Personal Information
          </h3>
          
          {user && (
            <div className="mb-6 p-4 bg-gray-50 rounded-md">
              <div className="text-sm text-gray-600">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Account Created:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
                {profile?.role && (
                  <p><strong>Role:</strong> <span className="capitalize">{profile.role}</span></p>
                )}
              </div>
            </div>
          )}

          <ProfileForm />
        </div>
      </div>
    </div>
  )
}
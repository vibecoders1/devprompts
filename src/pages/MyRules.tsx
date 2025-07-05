
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import RulesList from '@/components/RulesList';

const MyRules = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-white">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <RulesList showOnlyMyRules={true} />
      </div>
    </div>
  );
};

export default MyRules;

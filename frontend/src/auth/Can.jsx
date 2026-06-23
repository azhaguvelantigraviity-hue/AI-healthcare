import React from 'react';
import { useAuth } from '../context/AuthContext';
import { hasPermission } from './permissions';

const Can = ({ perform, yes, no }) => {
  const { user } = useAuth();
  
  if (!user || !user.role) {
    return no ? <>{no}</> : null;
  }

  const canPerform = hasPermission(user.role, perform);

  return canPerform ? <>{yes}</> : no ? <>{no}</> : null;
};

export default Can;

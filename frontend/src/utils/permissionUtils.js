export const hasPermission = (moduleName, action) => {
  const role = localStorage.getItem('role');
  
  // Super Admin has all permissions
  if (role === 'superAdmin') return true;

  try {
    const permissionsStr = localStorage.getItem('permissions');
    if (!permissionsStr) {
      console.warn("No permissions found in localStorage");
      return false;
    }

    const permissions = JSON.parse(permissionsStr);
    
    // Find module case-insensitively
    const actualModuleKey = Object.keys(permissions).find(
      key => key.toLowerCase() === moduleName.toLowerCase()
    );

    const modulePerms = actualModuleKey ? permissions[actualModuleKey] : [];
    const hasPerm = modulePerms.includes(action.toLowerCase());

    console.log(`Check: Module='${moduleName}', Action='${action}' -> Result=${hasPerm}`);
    return hasPerm;
  } catch (err) {
    console.error("Error parsing permissions", err);
    return false;
  }
};

/**
 * Convert a nested module-based permissions object into a flat permission array.
 * Example: { Users: ["view"] } -> ["users.view"]
 */
export function flattenPermissions(permissionsObj) {
  if (!permissionsObj || typeof permissionsObj !== 'object') return [];

  const flatArray = [];

  Object.entries(permissionsObj).forEach(([module, actions]) => {
    if (Array.isArray(actions)) {
      actions.forEach(action => {
        const cleanModule = module.toLowerCase().trim();
        flatArray.push(`${cleanModule}.${action.toLowerCase().trim()}`);
      });
    }
  });

  return [...new Set(flatArray)];
}

/**
 * Convert a flat permission array back to a nested module-based object.
 * Example: ["users.view"] -> { Users: ["view"] }
 */
export function unflattenPermissions(flatArray) {
  if (!Array.isArray(flatArray)) return {};

  return flatArray.reduce((acc, current) => {
    if (typeof current !== 'string') return acc;
    const [module, action] = current.split('.');
    if (!module || !action) return acc;

    const capitalizedModule = module.charAt(0).toUpperCase() + module.slice(1);
    
    if (!acc[capitalizedModule]) {
      acc[capitalizedModule] = [];
    }
    
    if (!acc[capitalizedModule].includes(action)) {
      acc[capitalizedModule].push(action);
    }
    
    return acc;
  }, {});
}

import { ReactTestInstance } from "react-test-renderer";

/**
 * * Utility function to find the host parent of a ReactTestInstance.
 * * This is useful for checking the styles of the parent component in tests.
 * 
 * @param element - The ReactTestInstance to find the host parent for.
 * @returns 
 */
export function getHostParent(element: ReactTestInstance) {
  let result = element.parent;
  while (result && typeof result.type !== 'string') {
     result = result.parent;
  }

  return result;
}

export default {}
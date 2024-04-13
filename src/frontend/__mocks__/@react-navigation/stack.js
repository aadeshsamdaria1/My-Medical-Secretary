// @react-navigation/stack.js
export const createStackNavigator = () => {
    const Stack = {
      Navigator: ({ children }) => children,
      Screen: () => null,
    };
    return Stack;
  };
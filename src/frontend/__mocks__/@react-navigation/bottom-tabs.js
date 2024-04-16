// __mocks__/@react-navigation/bottom-tabs.js
export const createBottomTabNavigator = () => {
    const Tab = {
      Navigator: ({ children }) => children,
      Screen: () => null,
    };
    return Tab;
  };
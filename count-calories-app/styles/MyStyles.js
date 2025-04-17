import { StyleSheet } from 'react-native';

export const ColorDarkCyan = "#0E9594";
export const ColorBlack = "#000000";
export const ColorEerieBlack = "#222222";
export const ColorNight = "#161616";
export const ColorWhite = "#FFFFFF";
export const ColorOnyx = "#444444";
export const ColorDimGray = "#666666";

export const footerStyle = StyleSheet.create({
  text: {
    fontWeight: "bold"
  },
  viewInside: {
    flex: 1,
     justifyContent: 'flex-start',
     margin: 8,
      alignItems: 'center',
       flexDirection: "column" 
  }
});

export const baseStyle = StyleSheet.create({
  base: {
    borderRadius: 8
  },
  text: {
    paddingHorizontal:10,
    paddingVertical:4
  }  
});

export const textInputStyle = StyleSheet.create({
  
});
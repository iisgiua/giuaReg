import { Pressable } from 'react-native';


export default ({ children, ...props }) => {
  // mostra componente  
  return <Pressable
    onPress={props.onPress}
    hitSlop={props.hitSlop}
    style={({ pressed }) => [props.style || {}, {opacity:pressed ? 0.5 : 1}]}
  >{children}</Pressable>
}

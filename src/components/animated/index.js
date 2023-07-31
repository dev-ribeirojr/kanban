import { TypeAnimation } from "react-type-animation";

export default function Typing({ text, el }) {

  return (
    <TypeAnimation
      key={text}
      sequence={[
        `${text}`,

        () => {
          {/* quando a animação termina */ }
        }
      ]}
      speed={30}
      wrapper={el}
      cursor={true}
      style={{ display: 'inline-block' }}
    />
  )
}
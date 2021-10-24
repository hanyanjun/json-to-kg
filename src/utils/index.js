export const generalId = () => {
    const s = (+new Date() / 1000).toString()
    return (
      +`${parseInt(s.substring(5), 10)}${parseInt((Math.random() * 10000).toString(), 10)}` %
      2147483647
    )
  }
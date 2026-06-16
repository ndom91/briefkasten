import debugFactory from "debug"

// type Info = (str: string) => void
type DebugWithInfo = debugFactory.Debugger & { info: (str: string) => void }

const debug = (namespace: string): DebugWithInfo => {
  const log = debugFactory(namespace)
  // @ts-expect-error extending with 'INFO' level logging method
  log.info = console.log.bind(console)

  // @ts-expect-error method is on derrr
  return log
}

export default debug

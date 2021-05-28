export function log() {
  return function ( _target: any, _propertKey: string, descriptor: PropertyDescriptor ) {
    if ( typeof descriptor.value == 'function' ) {
      const fn = descriptor.value
      descriptor.value = ( ...args: any[] ) => {
        console.log( `Function ${( fn as { name: string } ).name} is called with`, ...args )
        const _return = fn( ...args )
        console.log( `Function ${( fn as { name: string } ).name} returned with`, _return )
        return _return
      }
    }
  }
}

!function() {


/*
 * Draw: object to manage window resizing and canvas creation. 
 * Call Draw.init() to start drawing loop.
 */

window.Draw = {
  canvas:  document.querySelector( 'canvas' ),
  ctx:     null,     
  width:   window.innerWidth,
  height:  window.innerHeight,
  
  init: function() {
    this.ctx = this.canvas.getContext( '2d' )
    
    this.Graph.draw = this.Graph.draw.bind( this.Graph )
    
    Draw.resize()

    window.onresize = Draw.resize

    window.requestAnimationFrame( this.Graph.draw )
  },

  resize: function() {
    Draw.width  = window.innerWidth,
    Draw.height = window.innerHeight
 
    Draw.canvas.setAttribute( 'width',  Draw.width  )
    Draw.canvas.setAttribute( 'height', Draw.height )
  },

  /*
   * Draw.Graph: manage animation / children. Each child
   * pushed to the children array should have both a 
   * render() and a animate() method. Override setup to get
   * a per-frame callback.
   */

  Graph: {
    children: [],
    
    draw: function() {
      this.setup()
      this.animate()
      this.render()

      window.requestAnimationFrame( this.draw )
    },
    
    setup: function() {},

    animate: function() {
      for( var i = 0; i < this.children.length; i++ ) {
        this.children[ i ].animate()
      }
    },

    render:  function() {
      for( var i = 0; i < this.children.length; i++ ) {
        this.children[ i ].draw()
      }
    },
  }
}

}()

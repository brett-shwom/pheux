"use strict"

var Pheux = new function () {

    /* A virtualized scrolling component for RactiveJS */

    var pheuxCSS = multilineString(function () {/*
.pheux {
    height: 100%;
    width: 100%;
    overflow: scroll;
    -webkit-overflow-scrolling:touch;
}
*/})

    var pheuxTemplate = multilineString(function () {/*
<div class='pheux' on-scroll='scroll' style='-webkit-transform: translate3d(0,0,0)'>
    <div style='height:{{dataTable.length * rowHeight}}px; -webkit-transform: translate3d(0,0,0)'>
        <div class='scrollPane' style='position:-webkit-sticky;top:0;'><!--this div gets translated in the js-->
            {{#range(elementsInView.length)}}
                {{#elementsInView[.]}}
                    {{>content}}
                {{/elementsInView[.]}}
            {{/}}
        </div>
    </div>
</div>
*/})

    function multilineString(f) {
        return f.toString().split("\n").slice(1,-1).join('\n')
    }

    var buffer = 2

    function injectPheuxStyle() {
        var styleElement = document.createElement('style')
        styleElement.innerHTML = pheuxCSS
        document.body.appendChild(styleElement)
    }

    injectPheuxStyle()

    function getScrollPercentage(el) {
        return el.scrollTop / ((el.scrollHeight - el.clientHeight))
    }

    function range (n) { //TODO: on a long list, would be bad if this were called multiple times
        console.log('calling range')
        var i
          , rangeArray = []
        for (i=0;i<n;i++) {
            rangeArray.push(i)
        }
        return rangeArray
    }

    var ractiveComponent = Ractive.extend({
        template: pheuxTemplate,
        isolated : true,
        data : {
            elementsInView : [],
            numberOfElementsInStartBuffer : 0,
            numberOfElementsInView : 0,
            startIndex : 0,
            endIndex : 0,
            range : range
        },
        computeStartAndEndIndexAndNumberOfElementsInView : function () {
            
            this.data.startIndex = Math.max(Math.floor(Math.min(Math.max(getScrollPercentage(this._pheuxEl),0),1) * (this.data.dataTable.length - this.data.numberOfElementsInView)),0)
            this.data.endIndex = this.data.startIndex + this.data.numberOfElementsInView
            
        },
        updateElementsInView : function () {

            this.data.numberOfElementsInStartBuffer = Math.min(this.data.startIndex, buffer)
            this.merge('elementsInView', this.data.dataTable.slice(this.data.startIndex-this.data.numberOfElementsInStartBuffer,this.data.startIndex+this.data.numberOfElementsInView+buffer))
            
        },
        onrender: function () {  //TODO: Teardown this.on('scroll') ?
            
            this._pheuxEl = this.el.querySelector('.pheux')
            this._scrollPaneEl = this.el.querySelector('.scrollPane')
            this.data.numberOfElementsInView = Math.floor(this._pheuxEl.clientHeight / this.data.rowHeight)//TODO: eventually need to allow for fractional values
            this.data.startIndex = 0
            this.data.endIndex = this.data.numberOfElementsInView

            this.updateElementsInView()

            var scroll = function () {
                //console.log(this._pheuxEl.scrollTop)
            
                this.computeStartAndEndIndexAndNumberOfElementsInView()
                this.updateElementsInView()
                //this._scrollPaneEl.style.webkitTransform = "translate3d(0," + (this.data.startIndex * this.data.rowHeight - this.data.numberOfElementsInStartBuffer * this.data.rowHeight) + "px,0)"

                this._scrollPaneEl.style.webkitTransform = "translate3d(0," + -1 * (this._pheuxEl.scrollTop % this.data.rowHeight) + "px,0)"

                requestAnimationFrame(scroll)

            }.bind(this)

            scroll()


            // this.on( 'scroll', function () {
            //     console.log(this.data.startIndex , this.data.rowHeight , this.data.numberOfElementsInStartBuffer , this.data.rowHeight, this.data.startIndex * this.data.rowHeight - this.data.numberOfElementsInStartBuffer * this.data.rowHeight)
            //     requestAnimationFrame(function() {
            //         this.computeStartAndEndIndexAndNumberOfElementsInView()
            //         this.updateElementsInView()
            //     }.bind(this))
            // })

            /* Metrics */

            // ;(function () {
            //     /* measure pixels / second scrolled */

            //     var startingScrollTop
            //       , measurementInterval = 0.1

            //     setInterval(function () {
            //         var pixelsPerSecond = (startingScrollTop - this._pheuxEl.scrollTop) / measurementInterval
            //         var rowsPerSecond = pixelsPerSecond / this.data.rowHeight 
            //         RemoteDebug.log("scrolling at " , pixelsPerSecond, 'pixels per second',rowsPerSecond, 'rowsPerSecond' )
            //         startingScrollTop = this._pheuxEl.scrollTop
            //     }.bind(this),measurementInterval * 1000)
            // }.bind(this))()

            // ;(function () {

            //     /* artificial scrolling */

            //     var scrollTop = 0, pixelsPerInterval = 90, scrollEventsPerSecond = 40
            //     setInterval(function () {
            //         scrollTop += pixelsPerInterval
            //         this._pheuxEl.scrollTop = scrollTop
            //         this.trigger('scroll')
            //         RemoteDebug.log('triggering scroll at ', scrollEventsPerSecond * pixelsPerInterval , 'pixels per second')
            //     }.bind(this),1000 / scrollEventsPerSecond)

            // }.bind(this))()
            
            // ;(function () {

            //     /* measure scroll events per second */

            //     var measurementInterval = 1
            //       , scrollEventsPerSecondCallCount = 0
                
            //     this.on( 'scroll',function () {
            //         scrollEventsPerSecondCallCount+=1;  //measure scroll events per second 
            //     })
                
            //     setInterval(function () {
            //         RemoteDebug.log("scroll events per second", scrollEventsPerSecondCallCount / measurementInterval)
            //         scrollEventsPerSecondCallCount = 0
            //     }.bind(this),measurementInterval * 1000)

            // }.bind(this))()

            /*
                Safari on iOS 8 seems to max out at around 40 scroll events/second.  It is able to sustain that rate without great deviation.
            */

        }
    })

    this.ractiveComponent = ractiveComponent
    
}

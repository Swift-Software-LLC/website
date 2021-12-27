
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.3' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    window.requestAnimationFrame=window.requestAnimationFrame||(function(callback,element){setTimeout(callback,1000/60);});function timeStamp(){if(window.performance.now){return window.performance.now()}else {return Date.now()}}function isVisible(el){var r=el.getBoundingClientRect();return r.top+r.height>=0&&r.left+r.width>=0&&r.bottom-r.height<=(window.innerHeight||document.documentElement.clientHeight)&&r.right-r.width<=(window.innerWidth||document.documentElement.clientWidth)}function Star(x,y,z){this.x=x;this.y=y;this.z=z;this.size=0.5+Math.random();}function WarpSpeed(targetId,config){this.targetId=targetId;if(WarpSpeed.RUNNING_INSTANCES==undefined){WarpSpeed.RUNNING_INSTANCES={};}if(WarpSpeed.RUNNING_INSTANCES[targetId]){WarpSpeed.RUNNING_INSTANCES[targetId].destroy();}config=config||{};if(typeof config=="string"){try{config=JSON.parse(config);}catch(e){config={};}}this.SPEED=config.speed==undefined||config.speed<0?0.7:config.speed;this.TARGET_SPEED=config.targetSpeed==undefined||config.targetSpeed<0?this.SPEED:config.targetSpeed;this.SPEED_ADJ_FACTOR=config.speedAdjFactor==undefined?0.03:config.speedAdjFactor<0?0:config.speedAdjFactor>1?1:config.speedAdjFactor;this.DENSITY=config.density==undefined||config.density<=0?0.7:config.density;this.USE_CIRCLES=config.shape==undefined?true:config.shape=="circle";this.DEPTH_ALPHA=config.depthFade==undefined?true:config.depthFade;this.WARP_EFFECT=config.warpEffect==undefined?true:config.warpEffect;this.WARP_EFFECT_LENGTH=config.warpEffectLength==undefined?5:config.warpEffectLength<0?0:config.warpEffectLength;this.STAR_SCALE=config.starSize==undefined||config.starSize<=0?3:config.starSize;this.BACKGROUND_COLOR=config.backgroundColor==undefined?"hsl(263,45%,7%)":config.backgroundColor;var canvas=document.getElementById(this.targetId);canvas.width=1;canvas.height=1;this.STAR_COLOR=config.starColor==undefined?"#FFFFFF":config.starColor;this.prevW=-1;this.prevH=-1;this.stars=[];for(var i=0;i<this.DENSITY*1000;i+=1){this.stars.push(new Star((Math.random()-0.5)*1000,(Math.random()-0.5)*1000,1000*Math.random()));}this.lastMoveTS=timeStamp();this.drawRequest=null;this.LAST_RENDER_T=0;WarpSpeed.RUNNING_INSTANCES[targetId]=this;this.draw();}WarpSpeed.prototype={constructor:WarpSpeed,draw:function(){var TIME=timeStamp();if(!(document.getElementById(this.targetId))){this.destroy();return}this.move();var canvas=document.getElementById(this.targetId);if(!this.PAUSED&&isVisible(canvas)){if(this.prevW!=canvas.clientWidth||this.prevH!=canvas.clientHeight){canvas.width=(canvas.clientWidth<10?10:canvas.clientWidth)*(window.devicePixelRatio||1);canvas.height=(canvas.clientHeight<10?10:canvas.clientHeight)*(window.devicePixelRatio||1);}this.size=(canvas.height<canvas.width?canvas.height:canvas.width)/(10/(this.STAR_SCALE<=0?0:this.STAR_SCALE));if(this.WARP_EFFECT){this.maxLineWidth=this.size/30;}var ctx=canvas.getContext("2d");ctx.globalAlpha=1.0;ctx.fillStyle=this.BACKGROUND_COLOR;ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle=this.STAR_COLOR;for(var i=0;i<this.stars.length;i+=1){var s=this.stars[i];var xOnDisplay=s.x/s.z,yOnDisplay=s.y/s.z;if(!this.WARP_EFFECT&&(xOnDisplay<-0.5||xOnDisplay>0.5||yOnDisplay<-0.5||yOnDisplay>0.5)){continue}var size=s.size*this.size/s.z;if(size<0.3){continue;}if(this.DEPTH_ALPHA){var alpha=(1000-s.z)/1000;ctx.globalAlpha=alpha<0?0:alpha>1?1:alpha;}if(this.WARP_EFFECT){ctx.beginPath();var x2OnDisplay=s.x/(s.z+this.WARP_EFFECT_LENGTH*this.SPEED),y2OnDisplay=s.y/(s.z+this.WARP_EFFECT_LENGTH*this.SPEED);if(x2OnDisplay<-0.5||x2OnDisplay>0.5||y2OnDisplay<-0.5||y2OnDisplay>0.5){continue}ctx.moveTo(canvas.width*(xOnDisplay+0.5)-size/2,canvas.height*(yOnDisplay+0.5)-size/2);ctx.lineTo(canvas.width*(x2OnDisplay+0.5)-size/2,canvas.height*(y2OnDisplay+0.5)-size/2);ctx.lineWidth=size>this.maxLineWidth?this.maxLineWidth:size;if(this.USE_CIRCLES){ctx.lineCap="round";}else {ctx.lineCap="butt";}ctx.strokeStyle=ctx.fillStyle;ctx.stroke();}else if(this.USE_CIRCLES){ctx.beginPath();ctx.arc(canvas.width*(xOnDisplay+0.5)-size/2,canvas.height*(yOnDisplay+0.5)-size/2,size/2,0,2*Math.PI);ctx.fill();}else {ctx.fillRect(canvas.width*(xOnDisplay+0.5)-size/2,canvas.height*(yOnDisplay+0.5)-size/2,size,size);}}this.prevW=canvas.clientWidth;this.prevH=canvas.clientHeight;}if(this.drawRequest!=-1){this.drawRequest=requestAnimationFrame(this.draw.bind(this));}this.LAST_RENDER_T=timeStamp()-TIME;},move:function(){var t=timeStamp(),speedMulF=(t-this.lastMoveTS)/(1000/60);this.lastMoveTS=t;if(this.PAUSED){return}var speedAdjF=Math.pow(this.SPEED_ADJ_FACTOR<0?0:this.SPEED_ADJ_FACTOR>1?1:this.SPEED_ADJ_FACTOR,1/speedMulF);this.SPEED=this.TARGET_SPEED*speedAdjF+this.SPEED*(1-speedAdjF);if(this.SPEED<0){this.SPEED=0;}var speed=this.SPEED*speedMulF;for(var i=0;i<this.stars.length;i+=1){var s=this.stars[i];s.z-=speed;while(s.z<1){s.z+=1000;s.x=(Math.random()-0.5)*s.z;s.y=(Math.random()-0.5)*s.z;}}},destroy:function(targetId){if(targetId){if(WarpSpeed.RUNNING_INSTANCES[targetId]){WarpSpeed.RUNNING_INSTANCES[targetId].destroy();}}else {try{cancelAnimationFrame(this.drawRequest);}catch(e){this.drawRequest=-1;}WarpSpeed.RUNNING_INSTANCES[this.targetId]=undefined;}},pause:function(){this.PAUSED=true;},resume:function(){this.PAUSED=false;}};WarpSpeed.destroy=WarpSpeed.prototype.destroy;

    /* src/App.svelte generated by Svelte v3.44.3 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let scrolling = false;

    	let clear_scrolling = () => {
    		scrolling = false;
    	};

    	let scrolling_timeout;
    	let main;
    	let h1;
    	let t0;
    	let i;
    	let t2;
    	let canvas_1;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowscroll*/ ctx[1]);

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			t0 = text("Pure ");
    			i = element("i");
    			i.textContent = "Speed";
    			t2 = space();
    			canvas_1 = element("canvas");
    			add_location(i, file, 17, 24, 494);
    			attr_dev(h1, "class", "title svelte-13upl4v");
    			add_location(h1, file, 17, 1, 471);
    			set_style(canvas_1, "width", "100%");
    			set_style(canvas_1, "height", "100%");
    			attr_dev(canvas_1, "id", "warpspeed");
    			add_location(canvas_1, file, 18, 2, 514);
    			attr_dev(main, "class", "svelte-13upl4v");
    			add_location(main, file, 16, 0, 463);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(h1, t0);
    			append_dev(h1, i);
    			append_dev(main, t2);
    			append_dev(main, canvas_1);

    			if (!mounted) {
    				dispose = listen_dev(window, "scroll", () => {
    					scrolling = true;
    					clearTimeout(scrolling_timeout);
    					scrolling_timeout = setTimeout(clear_scrolling, 100);
    					/*onwindowscroll*/ ctx[1]();
    				});

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*scrollY*/ 1 && !scrolling) {
    				scrolling = true;
    				clearTimeout(scrolling_timeout);
    				scrollTo(window.pageXOffset, /*scrollY*/ ctx[0]);
    				scrolling_timeout = setTimeout(clear_scrolling, 100);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let scrollY;
    	let canvas;

    	onMount(() => {
    		// Add warp effect canvas
    		canvas = new WarpSpeed('warpspeed',
    		{
    				"speed": 4,
    				"speedAdjFactor": 0.03,
    				"density": 1.5,
    				"shape": "square",
    				"warpEffect": true,
    				"warpEffectLength": 7.5,
    				"depthFade": true,
    				"starSize": 3,
    				"backgroundColor": "hsl(263,45%,7%)",
    				"starColor": "#FFFFFF"
    			});
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function onwindowscroll() {
    		$$invalidate(0, scrollY = window.pageYOffset);
    	}

    	$$self.$capture_state = () => ({ onMount, scrollY, WarpSpeed, canvas });

    	$$self.$inject_state = $$props => {
    		if ('scrollY' in $$props) $$invalidate(0, scrollY = $$props.scrollY);
    		if ('canvas' in $$props) canvas = $$props.canvas;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [scrollY, onwindowscroll];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map

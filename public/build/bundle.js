
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
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
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
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
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

    /* src/sections/What-we-do.svelte generated by Svelte v3.44.3 */

    const file$5 = "src/sections/What-we-do.svelte";

    function create_fragment$6(ctx) {
    	let section1;
    	let section0;
    	let h10;
    	let t1;
    	let div3;
    	let div0;
    	let h11;
    	let t3;
    	let p0;
    	let t5;
    	let p1;
    	let t7;
    	let div1;
    	let h12;
    	let t9;
    	let p2;
    	let t11;
    	let p3;
    	let t13;
    	let div2;
    	let h13;
    	let t15;
    	let p4;
    	let t17;
    	let p5;

    	const block = {
    		c: function create() {
    			section1 = element("section");
    			section0 = element("section");
    			h10 = element("h1");
    			h10.textContent = "How we do it";
    			t1 = space();
    			div3 = element("div");
    			div0 = element("div");
    			h11 = element("h1");
    			h11.textContent = "Build";
    			t3 = space();
    			p0 = element("p");
    			p0.textContent = "We know being first to market is important. And we know how to build good software. We will turn your idea into a real product, that your users will love.";
    			t5 = space();
    			p1 = element("p");
    			p1.textContent = "We use a modern tech stack, focused on quick development, extendability and security. Building something quickly does not mean we slack on code quality, speed, and security.";
    			t7 = space();
    			div1 = element("div");
    			h12 = element("h1");
    			h12.textContent = "Improve";
    			t9 = space();
    			p2 = element("p");
    			p2.textContent = "To make sure we build exactly what you envision, we maintain a constant communication channel. We believe great communication is at the core of every great product.";
    			t11 = space();
    			p3 = element("p");
    			p3.textContent = "We work using Scrum and Agile, in sprints of two weeks, at the end of which we have an improved, and working product.";
    			t13 = space();
    			div2 = element("div");
    			h13 = element("h1");
    			h13.textContent = "Deliver";
    			t15 = space();
    			p4 = element("p");
    			p4.textContent = "Once you are happy with the product, we help you serve it to your first users. If there are big bugs or issues we will of course fix them.";
    			t17 = space();
    			p5 = element("p");
    			p5.textContent = "After this, we provide no more development work. Now it’s your turn to build out your own software team, and to really accelerate the growth of your startup!";
    			attr_dev(h10, "class", "header");
    			add_location(h10, file$5, 2, 4, 100);
    			attr_dev(h11, "class", "svelte-1vddomt");
    			add_location(h11, file$5, 5, 8, 199);
    			attr_dev(p0, "class", "svelte-1vddomt");
    			add_location(p0, file$5, 6, 8, 222);
    			attr_dev(p1, "class", "svelte-1vddomt");
    			add_location(p1, file$5, 7, 8, 392);
    			attr_dev(div0, "class", "grid__item svelte-1vddomt");
    			add_location(div0, file$5, 4, 6, 166);
    			attr_dev(h12, "class", "svelte-1vddomt");
    			add_location(h12, file$5, 11, 8, 628);
    			attr_dev(p2, "class", "svelte-1vddomt");
    			add_location(p2, file$5, 12, 8, 653);
    			attr_dev(p3, "class", "svelte-1vddomt");
    			add_location(p3, file$5, 13, 8, 834);
    			attr_dev(div1, "class", "grid__item svelte-1vddomt");
    			add_location(div1, file$5, 10, 6, 595);
    			attr_dev(h13, "class", "svelte-1vddomt");
    			add_location(h13, file$5, 17, 8, 1014);
    			attr_dev(p4, "class", "svelte-1vddomt");
    			add_location(p4, file$5, 18, 8, 1039);
    			attr_dev(p5, "class", "svelte-1vddomt");
    			add_location(p5, file$5, 19, 8, 1193);
    			attr_dev(div2, "class", "grid__item svelte-1vddomt");
    			add_location(div2, file$5, 16, 6, 981);
    			attr_dev(div3, "class", "grid svelte-1vddomt");
    			add_location(div3, file$5, 3, 4, 141);
    			attr_dev(section0, "id", "what-we-do");
    			attr_dev(section0, "class", "svelte-1vddomt");
    			add_location(section0, file$5, 1, 2, 70);
    			set_style(section1, "width", "100%");
    			set_style(section1, "background-color", "#000");
    			set_style(section1, "color", "#fff");
    			attr_dev(section1, "class", "svelte-1vddomt");
    			add_location(section1, file$5, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section1, anchor);
    			append_dev(section1, section0);
    			append_dev(section0, h10);
    			append_dev(section0, t1);
    			append_dev(section0, div3);
    			append_dev(div3, div0);
    			append_dev(div0, h11);
    			append_dev(div0, t3);
    			append_dev(div0, p0);
    			append_dev(div0, t5);
    			append_dev(div0, p1);
    			append_dev(div3, t7);
    			append_dev(div3, div1);
    			append_dev(div1, h12);
    			append_dev(div1, t9);
    			append_dev(div1, p2);
    			append_dev(div1, t11);
    			append_dev(div1, p3);
    			append_dev(div3, t13);
    			append_dev(div3, div2);
    			append_dev(div2, h13);
    			append_dev(div2, t15);
    			append_dev(div2, p4);
    			append_dev(div2, t17);
    			append_dev(div2, p5);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('What_we_do', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<What_we_do> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class What_we_do extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "What_we_do",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/sections/Splashscreen.svelte generated by Svelte v3.44.3 */

    const file$4 = "src/sections/Splashscreen.svelte";

    function create_fragment$5(ctx) {
    	let section;
    	let div2;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let h1;
    	let t2;
    	let h2;
    	let span0;
    	let t4;
    	let span1;
    	let t6;
    	let a;
    	let t7;
    	let span2;

    	const block = {
    		c: function create() {
    			section = element("section");
    			div2 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "We bring your startup to life";
    			t2 = space();
    			h2 = element("h2");
    			span0 = element("span");
    			span0.textContent = "Launch fast";
    			t4 = text(" with a minimum viable product your ");
    			span1 = element("span");
    			span1.textContent = "users will love";
    			t6 = space();
    			a = element("a");
    			t7 = text("Schedule a call ");
    			span2 = element("span");
    			span2.textContent = "➔";
    			if (!src_url_equal(img.src, img_src_value = "/img/rocket-launch.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-yd74re");
    			add_location(img, file$4, 3, 6, 98);
    			attr_dev(div0, "class", "splashscreen_content_image svelte-yd74re");
    			add_location(div0, file$4, 2, 4, 51);
    			attr_dev(h1, "class", "title svelte-yd74re");
    			add_location(h1, file$4, 7, 6, 255);
    			attr_dev(span0, "class", "gradient-text");
    			add_location(span0, file$4, 8, 27, 335);
    			attr_dev(span1, "class", "gradient-text");
    			add_location(span1, file$4, 8, 109, 417);
    			attr_dev(h2, "class", "subtitle svelte-yd74re");
    			add_location(h2, file$4, 8, 6, 314);
    			set_style(span2, "display", "inline-block");
    			set_style(span2, "transform", "rotate(-45deg)");
    			set_style(span2, "margin-left", "0.5rem");
    			add_location(span2, file$4, 9, 188, 661);
    			attr_dev(a, "href", "");
    			attr_dev(a, "class", "button");
    			set_style(a, "margin-top", "2rem");
    			attr_dev(a, "onclick", "Calendly.initPopupWidget({url: 'https://calendly.com/swiftsoftware/introduction-call'});return false;");
    			add_location(a, file$4, 9, 6, 479);
    			attr_dev(div1, "class", "splashscreen_content_headings svelte-yd74re");
    			add_location(div1, file$4, 6, 4, 205);
    			attr_dev(div2, "class", "splashscreen_content svelte-yd74re");
    			add_location(div2, file$4, 1, 2, 12);
    			attr_dev(section, "class", "svelte-yd74re");
    			add_location(section, file$4, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div2);
    			append_dev(div2, div0);
    			append_dev(div0, img);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, h1);
    			append_dev(div1, t2);
    			append_dev(div1, h2);
    			append_dev(h2, span0);
    			append_dev(h2, t4);
    			append_dev(h2, span1);
    			append_dev(div1, t6);
    			append_dev(div1, a);
    			append_dev(a, t7);
    			append_dev(a, span2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Splashscreen', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Splashscreen> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Splashscreen extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Splashscreen",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/sections/Why-a-mvp.svelte generated by Svelte v3.44.3 */

    const file$3 = "src/sections/Why-a-mvp.svelte";

    function create_fragment$4(ctx) {
    	let section1;
    	let section0;
    	let h10;
    	let t1;
    	let div4;
    	let div0;
    	let h11;
    	let t3;
    	let p0;
    	let t5;
    	let div1;
    	let h12;
    	let t7;
    	let p1;
    	let t9;
    	let div2;
    	let h13;
    	let t11;
    	let p2;
    	let t13;
    	let div3;
    	let h14;
    	let t15;
    	let p3;

    	const block = {
    		c: function create() {
    			section1 = element("section");
    			section0 = element("section");
    			h10 = element("h1");
    			h10.textContent = "Why a MVP?";
    			t1 = space();
    			div4 = element("div");
    			div0 = element("div");
    			h11 = element("h1");
    			h11.textContent = "Reduced risk";
    			t3 = space();
    			p0 = element("p");
    			p0.textContent = "Building a full-featured product, only to find out there is no market for it, sucks.\n          We focus on building a product with the vital features needed to test your product's main assumptions.";
    			t5 = space();
    			div1 = element("div");
    			h12 = element("h1");
    			h12.textContent = "Reduced cost";
    			t7 = space();
    			p1 = element("p");
    			p1.textContent = "By building a product with only the vital features, not only the risk is reduced, the cost is as well.\n          Maintenance costs will also be reduced, less features means less maintentance.";
    			t9 = space();
    			div2 = element("div");
    			h13 = element("h1");
    			h13.textContent = "Time to market";
    			t11 = space();
    			p2 = element("p");
    			p2.textContent = "We know being first to market can be very important. By building a MVP you will reduce development time, and beat your competitors to market.";
    			t13 = space();
    			div3 = element("div");
    			h14 = element("h1");
    			h14.textContent = "Growth";
    			t15 = space();
    			p3 = element("p");
    			p3.textContent = "A MVP is the easiest way to quickly grow your business. By validating your idea, and getting your first users on board, venture capital will be much easier to obtain.";
    			attr_dev(h10, "class", "header");
    			add_location(h10, file$3, 2, 4, 99);
    			attr_dev(h11, "class", "svelte-16yj4w4");
    			add_location(h11, file$3, 5, 8, 196);
    			attr_dev(p0, "class", "svelte-16yj4w4");
    			add_location(p0, file$3, 6, 8, 226);
    			attr_dev(div0, "class", "grid__item svelte-16yj4w4");
    			add_location(div0, file$3, 4, 6, 163);
    			attr_dev(h12, "class", "svelte-16yj4w4");
    			add_location(h12, file$3, 13, 8, 506);
    			attr_dev(p1, "class", "svelte-16yj4w4");
    			add_location(p1, file$3, 14, 8, 536);
    			attr_dev(div1, "class", "grid__item svelte-16yj4w4");
    			add_location(div1, file$3, 12, 6, 473);
    			attr_dev(h13, "class", "svelte-16yj4w4");
    			add_location(h13, file$3, 21, 8, 810);
    			attr_dev(p2, "class", "svelte-16yj4w4");
    			add_location(p2, file$3, 22, 8, 842);
    			attr_dev(div2, "class", "grid__item svelte-16yj4w4");
    			add_location(div2, file$3, 20, 6, 777);
    			attr_dev(h14, "class", "svelte-16yj4w4");
    			add_location(h14, file$3, 26, 8, 1044);
    			attr_dev(p3, "class", "svelte-16yj4w4");
    			add_location(p3, file$3, 27, 8, 1068);
    			attr_dev(div3, "class", "grid__item svelte-16yj4w4");
    			add_location(div3, file$3, 25, 6, 1011);
    			attr_dev(div4, "class", "grid svelte-16yj4w4");
    			add_location(div4, file$3, 3, 4, 138);
    			attr_dev(section0, "id", "why-a-mvp");
    			attr_dev(section0, "class", "svelte-16yj4w4");
    			add_location(section0, file$3, 1, 2, 70);
    			set_style(section1, "width", "100%");
    			set_style(section1, "background-color", "#000");
    			set_style(section1, "color", "#fff");
    			attr_dev(section1, "class", "svelte-16yj4w4");
    			add_location(section1, file$3, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section1, anchor);
    			append_dev(section1, section0);
    			append_dev(section0, h10);
    			append_dev(section0, t1);
    			append_dev(section0, div4);
    			append_dev(div4, div0);
    			append_dev(div0, h11);
    			append_dev(div0, t3);
    			append_dev(div0, p0);
    			append_dev(div4, t5);
    			append_dev(div4, div1);
    			append_dev(div1, h12);
    			append_dev(div1, t7);
    			append_dev(div1, p1);
    			append_dev(div4, t9);
    			append_dev(div4, div2);
    			append_dev(div2, h13);
    			append_dev(div2, t11);
    			append_dev(div2, p2);
    			append_dev(div4, t13);
    			append_dev(div4, div3);
    			append_dev(div3, h14);
    			append_dev(div3, t15);
    			append_dev(div3, p3);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Why_a_mvp', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Why_a_mvp> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Why_a_mvp extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Why_a_mvp",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/sections/Money.svelte generated by Svelte v3.44.3 */

    const file$2 = "src/sections/Money.svelte";

    function create_fragment$3(ctx) {
    	let section1;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let section0;
    	let h1;
    	let t2;
    	let p0;
    	let t4;
    	let p1;
    	let t6;
    	let p2;
    	let t8;
    	let p3;
    	let t9;
    	let a;
    	let t11;
    	let t12;
    	let img1;
    	let img1_src_value;

    	const block = {
    		c: function create() {
    			section1 = element("section");
    			img0 = element("img");
    			t0 = space();
    			section0 = element("section");
    			h1 = element("h1");
    			h1.textContent = "Cost";
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "It’s hard to give a number. Total cost of a project depends on many factors. \n      What is the scale of the project, how much time will it cost, does design work have to be done, how many developers will be required, what are the performance requirements, et cetera.";
    			t4 = space();
    			p1 = element("p");
    			p1.textContent = "Keep in mind, developers are expensive, especially good ones. \n      A conservative estimate for a month of work is around $30,000. Most projects take around 3-4 months, putting the total cost at $90,000-$120,000.";
    			t6 = space();
    			p2 = element("p");
    			p2.textContent = "Most startups, however, do not have this kind of capital. \n      Especially if they are just starting out. We understand this, so pitch us your idea, with validation, and we will allow you to pay part of the costs with equity. \n      The amount of equity will be decided based on the current valuation of your startup, among other factors.";
    			t8 = space();
    			p3 = element("p");
    			t9 = text("To get a better idea of the cost for your MVP, don’t hesitate to ");
    			a = element("a");
    			a.textContent = "contact us";
    			t11 = text(". We can schedule a call to discuss details.");
    			t12 = space();
    			img1 = element("img");
    			if (!src_url_equal(img0.src, img0_src_value = "/img/euro.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "");
    			attr_dev(img0, "class", "svelte-17v1gnr");
    			add_location(img0, file$2, 1, 2, 33);
    			attr_dev(h1, "class", "header");
    			add_location(h1, file$2, 3, 4, 92);
    			attr_dev(p0, "class", "svelte-17v1gnr");
    			add_location(p0, file$2, 4, 4, 125);
    			attr_dev(p1, "class", "svelte-17v1gnr");
    			add_location(p1, file$2, 8, 4, 416);
    			attr_dev(p2, "class", "svelte-17v1gnr");
    			add_location(p2, file$2, 12, 4, 654);
    			attr_dev(a, "href", "#contact-us");
    			add_location(a, file$2, 18, 71, 1092);
    			attr_dev(p3, "class", "svelte-17v1gnr");
    			add_location(p3, file$2, 17, 4, 1017);
    			attr_dev(section0, "id", "cost");
    			attr_dev(section0, "class", "svelte-17v1gnr");
    			add_location(section0, file$2, 2, 2, 68);
    			if (!src_url_equal(img1.src, img1_src_value = "/img/chart.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "");
    			attr_dev(img1, "class", "svelte-17v1gnr");
    			add_location(img1, file$2, 21, 2, 1197);
    			set_style(section1, "width", "100%");
    			attr_dev(section1, "class", "svelte-17v1gnr");
    			add_location(section1, file$2, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section1, anchor);
    			append_dev(section1, img0);
    			append_dev(section1, t0);
    			append_dev(section1, section0);
    			append_dev(section0, h1);
    			append_dev(section0, t2);
    			append_dev(section0, p0);
    			append_dev(section0, t4);
    			append_dev(section0, p1);
    			append_dev(section0, t6);
    			append_dev(section0, p2);
    			append_dev(section0, t8);
    			append_dev(section0, p3);
    			append_dev(p3, t9);
    			append_dev(p3, a);
    			append_dev(p3, t11);
    			append_dev(section1, t12);
    			append_dev(section1, img1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Money', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Money> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Money extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Money",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/sections/Contact.svelte generated by Svelte v3.44.3 */

    const file$1 = "src/sections/Contact.svelte";

    function create_fragment$2(ctx) {
    	let section1;
    	let section0;
    	let h1;
    	let t1;
    	let p0;
    	let t3;
    	let div3;
    	let div0;
    	let p1;
    	let t5;
    	let p2;
    	let a;
    	let t7;
    	let div1;
    	let p3;
    	let t9;
    	let p4;
    	let t11;
    	let div2;
    	let p5;
    	let t13;
    	let p6;

    	const block = {
    		c: function create() {
    			section1 = element("section");
    			section0 = element("section");
    			h1 = element("h1");
    			h1.textContent = "Contact us";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "Send us an email to schedule a call, and we will get back to you within 24 hours.";
    			t3 = space();
    			div3 = element("div");
    			div0 = element("div");
    			p1 = element("p");
    			p1.textContent = "Email:";
    			t5 = space();
    			p2 = element("p");
    			a = element("a");
    			a.textContent = "contact@swiftsoftware.nl";
    			t7 = space();
    			div1 = element("div");
    			p3 = element("p");
    			p3.textContent = "Phone:";
    			t9 = space();
    			p4 = element("p");
    			p4.textContent = "(+31) 637290533";
    			t11 = space();
    			div2 = element("div");
    			p5 = element("p");
    			p5.textContent = "KVK:";
    			t13 = space();
    			p6 = element("p");
    			p6.textContent = "81934580";
    			attr_dev(h1, "class", "header");
    			add_location(h1, file$1, 2, 4, 100);
    			attr_dev(p0, "class", "svelte-10ktd6d");
    			add_location(p0, file$1, 3, 4, 139);
    			attr_dev(p1, "class", "svelte-10ktd6d");
    			add_location(p1, file$1, 6, 8, 306);
    			attr_dev(a, "href", "mailto:contact@swiftsoftware.nl");
    			add_location(a, file$1, 7, 11, 331);
    			attr_dev(p2, "class", "svelte-10ktd6d");
    			add_location(p2, file$1, 7, 8, 328);
    			attr_dev(div0, "id", "contact-details__item");
    			attr_dev(div0, "class", "svelte-10ktd6d");
    			add_location(div0, file$1, 5, 6, 265);
    			attr_dev(p3, "class", "svelte-10ktd6d");
    			add_location(p3, file$1, 10, 8, 466);
    			attr_dev(p4, "class", "svelte-10ktd6d");
    			add_location(p4, file$1, 11, 8, 488);
    			attr_dev(div1, "id", "contact-details__item");
    			attr_dev(div1, "class", "svelte-10ktd6d");
    			add_location(div1, file$1, 9, 6, 425);
    			attr_dev(p5, "class", "svelte-10ktd6d");
    			add_location(p5, file$1, 14, 8, 571);
    			attr_dev(p6, "class", "svelte-10ktd6d");
    			add_location(p6, file$1, 15, 8, 591);
    			attr_dev(div2, "id", "contact-details__item");
    			attr_dev(div2, "class", "svelte-10ktd6d");
    			add_location(div2, file$1, 13, 6, 530);
    			attr_dev(div3, "id", "contact-details");
    			add_location(div3, file$1, 4, 4, 232);
    			attr_dev(section0, "id", "contact-us");
    			attr_dev(section0, "class", "svelte-10ktd6d");
    			add_location(section0, file$1, 1, 2, 70);
    			set_style(section1, "width", "100%");
    			set_style(section1, "background-color", "#000");
    			set_style(section1, "color", "#fff");
    			attr_dev(section1, "class", "svelte-10ktd6d");
    			add_location(section1, file$1, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section1, anchor);
    			append_dev(section1, section0);
    			append_dev(section0, h1);
    			append_dev(section0, t1);
    			append_dev(section0, p0);
    			append_dev(section0, t3);
    			append_dev(section0, div3);
    			append_dev(div3, div0);
    			append_dev(div0, p1);
    			append_dev(div0, t5);
    			append_dev(div0, p2);
    			append_dev(p2, a);
    			append_dev(div3, t7);
    			append_dev(div3, div1);
    			append_dev(div1, p3);
    			append_dev(div1, t9);
    			append_dev(div1, p4);
    			append_dev(div3, t11);
    			append_dev(div3, div2);
    			append_dev(div2, p5);
    			append_dev(div2, t13);
    			append_dev(div2, p6);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Contact', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Contact> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Contact extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Contact",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/sections/Timeline.svelte generated by Svelte v3.44.3 */

    const file = "src/sections/Timeline.svelte";

    function create_fragment$1(ctx) {
    	let section;
    	let h10;
    	let t1;
    	let div5;
    	let div0;
    	let h11;
    	let t3;
    	let p0;
    	let t5;
    	let p1;
    	let t7;
    	let div1;
    	let h12;
    	let t9;
    	let p2;
    	let t11;
    	let div2;
    	let h13;
    	let t13;
    	let p3;
    	let t15;
    	let p4;
    	let t17;
    	let div3;
    	let h14;
    	let t19;
    	let p5;
    	let t21;
    	let div4;
    	let h15;
    	let t23;
    	let p6;

    	const block = {
    		c: function create() {
    			section = element("section");
    			h10 = element("h1");
    			h10.textContent = "Project timeline";
    			t1 = space();
    			div5 = element("div");
    			div0 = element("div");
    			h11 = element("h1");
    			h11.textContent = "Intro Call";
    			t3 = space();
    			p0 = element("p");
    			p0.textContent = "We begin with a fairly short introduction call where we learn about your idea, what you want us to build, and other project parameters.";
    			t5 = space();
    			p1 = element("p");
    			p1.textContent = "Based on this introduction call we will give a cost and time estimate.";
    			t7 = space();
    			div1 = element("div");
    			h12 = element("h1");
    			h12.textContent = "Requirements Gathering";
    			t9 = space();
    			p2 = element("p");
    			p2.textContent = "In a focus session with you we formulate the list of requirements. Based on these specific requirements we will give the final cost, and time the project will take.";
    			t11 = space();
    			div2 = element("div");
    			h13 = element("h1");
    			h13.textContent = "User Interface";
    			t13 = space();
    			p3 = element("p");
    			p3.textContent = "If we are tasked with designing the MVP as well, we will begin with the most important screens. We will design these screens in a few styles.";
    			t15 = space();
    			p4 = element("p");
    			p4.textContent = "Based on your feedback we will choose a style for the MVP, and design the rest of the application.";
    			t17 = space();
    			div3 = element("div");
    			h14 = element("h1");
    			h14.textContent = "Development";
    			t19 = space();
    			p5 = element("p");
    			p5.textContent = "We develop the MVP. We do this in bi-weekly increments, meaning there is an updated application every two weeks. We do this so your feedback can be incorporated often, and quickly.";
    			t21 = space();
    			div4 = element("div");
    			h15 = element("h1");
    			h15.textContent = "Delivery";
    			t23 = space();
    			p6 = element("p");
    			p6.textContent = "Once the application is fully developed, we help you deploy it to your first users. In this phase we fix unseen bugs and issues.";
    			attr_dev(h10, "class", "header");
    			add_location(h10, file, 1, 2, 12);
    			add_location(h11, file, 4, 6, 117);
    			attr_dev(p0, "class", "svelte-1qwcahb");
    			add_location(p0, file, 5, 6, 143);
    			attr_dev(p1, "class", "svelte-1qwcahb");
    			add_location(p1, file, 6, 6, 292);
    			attr_dev(div0, "class", "timeline__item svelte-1qwcahb");
    			add_location(div0, file, 3, 4, 82);
    			add_location(h12, file, 9, 6, 420);
    			attr_dev(p2, "class", "svelte-1qwcahb");
    			add_location(p2, file, 10, 6, 458);
    			attr_dev(div1, "class", "timeline__item svelte-1qwcahb");
    			add_location(div1, file, 8, 4, 385);
    			add_location(h13, file, 13, 6, 680);
    			attr_dev(p3, "class", "svelte-1qwcahb");
    			add_location(p3, file, 14, 6, 710);
    			attr_dev(p4, "class", "svelte-1qwcahb");
    			add_location(p4, file, 15, 6, 865);
    			attr_dev(div2, "class", "timeline__item svelte-1qwcahb");
    			add_location(div2, file, 12, 4, 645);
    			add_location(h14, file, 18, 6, 1021);
    			attr_dev(p5, "class", "svelte-1qwcahb");
    			add_location(p5, file, 19, 6, 1048);
    			attr_dev(div3, "class", "timeline__item svelte-1qwcahb");
    			add_location(div3, file, 17, 4, 986);
    			add_location(h15, file, 22, 6, 1286);
    			attr_dev(p6, "class", "svelte-1qwcahb");
    			add_location(p6, file, 23, 6, 1310);
    			attr_dev(div4, "class", "timeline__item svelte-1qwcahb");
    			add_location(div4, file, 21, 4, 1251);
    			attr_dev(div5, "class", "timeline svelte-1qwcahb");
    			add_location(div5, file, 2, 2, 55);
    			attr_dev(section, "class", "svelte-1qwcahb");
    			add_location(section, file, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h10);
    			append_dev(section, t1);
    			append_dev(section, div5);
    			append_dev(div5, div0);
    			append_dev(div0, h11);
    			append_dev(div0, t3);
    			append_dev(div0, p0);
    			append_dev(div0, t5);
    			append_dev(div0, p1);
    			append_dev(div5, t7);
    			append_dev(div5, div1);
    			append_dev(div1, h12);
    			append_dev(div1, t9);
    			append_dev(div1, p2);
    			append_dev(div5, t11);
    			append_dev(div5, div2);
    			append_dev(div2, h13);
    			append_dev(div2, t13);
    			append_dev(div2, p3);
    			append_dev(div2, t15);
    			append_dev(div2, p4);
    			append_dev(div5, t17);
    			append_dev(div5, div3);
    			append_dev(div3, h14);
    			append_dev(div3, t19);
    			append_dev(div3, p5);
    			append_dev(div5, t21);
    			append_dev(div5, div4);
    			append_dev(div4, h15);
    			append_dev(div4, t23);
    			append_dev(div4, p6);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Timeline', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Timeline> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Timeline extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Timeline",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.44.3 */

    function create_fragment(ctx) {
    	let splashscreen;
    	let t0;
    	let whyamvp;
    	let t1;
    	let whatwedo;
    	let t2;
    	let timeline;
    	let t3;
    	let contact;
    	let current;
    	splashscreen = new Splashscreen({ $$inline: true });
    	whyamvp = new Why_a_mvp({ $$inline: true });
    	whatwedo = new What_we_do({ $$inline: true });
    	timeline = new Timeline({ $$inline: true });
    	contact = new Contact({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(splashscreen.$$.fragment);
    			t0 = space();
    			create_component(whyamvp.$$.fragment);
    			t1 = space();
    			create_component(whatwedo.$$.fragment);
    			t2 = space();
    			create_component(timeline.$$.fragment);
    			t3 = space();
    			create_component(contact.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(splashscreen, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(whyamvp, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(whatwedo, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(timeline, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(contact, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(splashscreen.$$.fragment, local);
    			transition_in(whyamvp.$$.fragment, local);
    			transition_in(whatwedo.$$.fragment, local);
    			transition_in(timeline.$$.fragment, local);
    			transition_in(contact.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(splashscreen.$$.fragment, local);
    			transition_out(whyamvp.$$.fragment, local);
    			transition_out(whatwedo.$$.fragment, local);
    			transition_out(timeline.$$.fragment, local);
    			transition_out(contact.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(splashscreen, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(whyamvp, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(whatwedo, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(timeline, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(contact, detaching);
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
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		WhatWeDo: What_we_do,
    		Splashscreen,
    		WhyAMVP: Why_a_mvp,
    		Money,
    		Contact,
    		Timeline,
    		WhyAMvp: Why_a_mvp
    	});

    	return [];
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

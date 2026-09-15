import{n as e,t}from"./index-vG7El1BF.js";import{A as n,B as r,C as i,D as a,E as o,F as s,G as c,H as l,I as u,J as d,K as f,L as p,M as m,N as h,O as ee,P as te,R as g,S as ne,T as _,U as re,V as ie,W as v,X as ae,Y as oe,_ as se,a as ce,b as le,c as ue,d as de,f as fe,g as pe,h as me,i as he,j as ge,k as _e,l as ve,m as ye,n as be,o as xe,p as Se,q as Ce,r as we,s as Te,t as Ee,u as De,v as Oe,w as ke,x as Ae,y as je,z as y}from"./dist-B4v2uhxg.js";var b=e(),x=typeof String.prototype.normalize==`function`?e=>e.normalize(`NFKD`):e=>e,S=class{constructor(e,t,n=0,r=e.length,i,a){this.test=a,this.value={from:0,to:0,precise:!1},this.done=!1,this.matches=[],this.buffer=``,this.bufferPos=0,this.iter=e.iterRange(n,r),this.bufferStart=n,this.normalize=i?e=>i(x(e)):x,this.query=this.normalize(t)}peek(){if(this.bufferPos==this.buffer.length){if(this.bufferStart+=this.buffer.length,this.iter.next(),this.iter.done)return-1;this.bufferPos=0,this.buffer=this.iter.value}return f(this.buffer,this.bufferPos)}next(){for(;this.matches.length;)this.matches.pop();return this.nextOverlapping()}nextOverlapping(){for(;;){let e=this.peek();if(e<0)return this.done=!0,this;let t=ae(e),n=this.bufferStart+this.bufferPos;this.bufferPos+=Ce(e);let r=this.normalize(t);if(r.length)for(let e=0,i=n,a=!0;;e++){let n=r.charCodeAt(e),o=this.match(n,i,a,this.bufferPos+this.bufferStart,e==r.length-1);if(o)return this.value=o,this;if(e==r.length-1)break;a&&e<t.length&&t.charCodeAt(e)==n?i++:a=!1}}}match(e,t,n,r,i){let a=null;for(let t=0;t<this.matches.length;){let n=this.matches[t],o=!1;this.query.charCodeAt(n.index)==e&&(n.index==this.query.length-1?a={from:n.from,to:r,precise:i&&n.precise}:(n.index++,o=!0)),o?t++:this.matches.splice(t,1)}return this.query.charCodeAt(0)==e&&(this.query.length==1?a={from:t,to:r,precise:n&&i}:this.matches.push({from:t,index:1,precise:n})),a&&this.test&&!this.test(a.from,a.to,this.buffer,this.bufferStart)&&(a=null),a}};typeof Symbol<`u`&&(S.prototype[Symbol.iterator]=function(){return this});var C={from:-1,to:-1,match:/.*/.exec(``),precise:!0},w=`gm`+(/x/.unicode==null?``:`u`),Me=class{constructor(e,t,n,r=0,i=e.length){if(this.text=e,this.to=i,this.curLine=``,this.done=!1,this.value=C,/\\[sWDnr]|\n|\r|\[\^/.test(t))return new Pe(e,t,n,r,i);this.re=new RegExp(t,w+(n?.ignoreCase?`i`:``)),this.test=n?.test,this.iter=e.iter();let a=e.lineAt(r);this.curLineStart=a.from,this.matchPos=E(e,r),this.getLine(this.curLineStart)}getLine(e){this.iter.next(e),this.iter.lineBreak?this.curLine=``:(this.curLine=this.iter.value,this.curLineStart+this.curLine.length>this.to&&(this.curLine=this.curLine.slice(0,this.to-this.curLineStart)),this.iter.next())}nextLine(){this.curLineStart=this.curLineStart+this.curLine.length+1,this.curLineStart>this.to?this.curLine=``:this.getLine(0)}next(){for(let e=this.matchPos-this.curLineStart;;){this.re.lastIndex=e;let t=this.matchPos<=this.to&&this.re.exec(this.curLine);if(t){let n=this.curLineStart+t.index,r=n+t[0].length;if(this.matchPos=E(this.text,r+ +(n==r)),n==this.curLineStart+this.curLine.length&&this.nextLine(),(n<r||n>this.value.to)&&(!this.test||this.test(n,r,t)))return this.value={from:n,to:r,precise:!0,match:t},this;e=this.matchPos-this.curLineStart}else if(this.curLineStart+this.curLine.length<this.to)this.nextLine(),e=0;else return this.done=!0,this}}},T=new WeakMap,Ne=class e{constructor(e,t){this.from=e,this.text=t}get to(){return this.from+this.text.length}static get(t,n,r){let i=T.get(t);if(!i||i.from>=r||i.to<=n){let i=new e(n,t.sliceString(n,r));return T.set(t,i),i}if(i.from==n&&i.to==r)return i;let{text:a,from:o}=i;return o>n&&(a=t.sliceString(n,o)+a,o=n),i.to<r&&(a+=t.sliceString(i.to,r)),T.set(t,new e(o,a)),new e(n,a.slice(n-o,r-o))}},Pe=class{constructor(e,t,n,r,i){this.text=e,this.to=i,this.done=!1,this.value=C,this.matchPos=E(e,r),this.re=new RegExp(t,w+(n?.ignoreCase?`i`:``)),this.test=n?.test,this.flat=Ne.get(e,r,this.chunkEnd(r+5e3))}chunkEnd(e){return e>=this.to?this.to:this.text.lineAt(e).to}next(){for(;;){let e=this.re.lastIndex=this.matchPos-this.flat.from,t=this.re.exec(this.flat.text);if(t&&!t[0]&&t.index==e&&(this.re.lastIndex=e+1,t=this.re.exec(this.flat.text)),t){let e=this.flat.from+t.index,n=e+t[0].length;if((this.flat.to>=this.to||t.index+t[0].length<=this.flat.text.length-10)&&(!this.test||this.test(e,n,t)))return this.value={from:e,to:n,precise:!0,match:t},this.matchPos=E(this.text,n+ +(e==n)),this}if(this.flat.to==this.to)return this.done=!0,this;this.flat=Ne.get(this.text,this.flat.from,this.chunkEnd(this.flat.from+this.flat.text.length*2))}}};typeof Symbol<`u`&&(Me.prototype[Symbol.iterator]=Pe.prototype[Symbol.iterator]=function(){return this});function Fe(e){try{return new RegExp(e,w),!0}catch{return!1}}function E(e,t){if(t>=e.length)return t;let n=e.lineAt(t),r;for(;t<n.to&&(r=n.text.charCodeAt(t-n.from))>=56320&&r<57344;)t++;return t}var Ie=e=>{let t=_e(e,`cm-goto-line`);if(t){let e=t.dom.querySelector(`input[type=text]`);return e&&e.select(),!0}let{state:n}=e,r=String(n.doc.lineAt(e.state.selection.main.head).number),{close:i,result:o}=s(e,{class:`cm-goto-line`,label:n.phrase(`Go to line`),input:{type:`text`,name:`line`,value:r},focus:!0,submitLabel:n.phrase(`go`)});return o.then(t=>{let r=t&&/^([+-])?(\d+)?(:\d+)?(%)?$/.exec(t.elements.line.value);if(!r){e.dispatch({effects:i});return}let o=n.doc.lineAt(n.selection.main.head),[,s,c,l,u]=r,d=l?+l.slice(1):0,f=c?+c:o.number;if(c&&u){let e=f/100;s&&(e=e*(s==`-`?-1:1)+o.number/n.doc.lines),f=Math.round(n.doc.lines*e)}else c&&s&&(f=f*(s==`-`?-1:1)+o.number);let p=n.doc.line(Math.max(1,Math.min(n.doc.lines,f))),m=y.cursor(p.from+Math.max(0,Math.min(d,p.length)));e.dispatch({effects:[i,a.scrollIntoView(m.from,{y:`center`})],selection:m})}),!0},Le={highlightWordAroundCursor:!1,minSelectionLength:1,maxMatches:100,wholeWords:!1},Re=ie.define({combine(e){return d(e,Le,{highlightWordAroundCursor:(e,t)=>e||t,minSelectionLength:Math.min,maxMatches:Math.min})}});function ze(e){let t=[Ge,We];return e&&t.push(Re.of(e)),t}var Be=o.mark({class:`cm-selectionMatch`}),Ve=o.mark({class:`cm-selectionMatch cm-selectionMatch-main`});function He(e,t,n,r){return(n==0||e(t.sliceDoc(n-1,n))!=g.Word)&&(r==t.doc.length||e(t.sliceDoc(r,r+1))!=g.Word)}function Ue(e,t,n,r){return e(t.sliceDoc(n,n+1))==g.Word&&e(t.sliceDoc(r-1,r))==g.Word}var We=ee.fromClass(class{constructor(e){this.decorations=this.getDeco(e)}update(e){(e.selectionSet||e.docChanged||e.viewportChanged)&&(this.decorations=this.getDeco(e.view))}getDeco(e){let t=e.state.facet(Re),{state:n}=e,r=n.selection;if(r.ranges.length>1)return o.none;let i=r.main,a,s=null;if(i.empty){if(!t.highlightWordAroundCursor)return o.none;let e=n.wordAt(i.head);if(!e)return o.none;s=n.charCategorizer(i.head),a=n.sliceDoc(e.from,e.to)}else{let e=i.to-i.from;if(e<t.minSelectionLength||e>200)return o.none;if(t.wholeWords){if(a=n.sliceDoc(i.from,i.to),s=n.charCategorizer(i.head),!(He(s,n,i.from,i.to)&&Ue(s,n,i.from,i.to)))return o.none}else if(a=n.sliceDoc(i.from,i.to),!a)return o.none}let c=[];for(let r of e.visibleRanges){let e=new S(n.doc,a,r.from,r.to);for(;!e.next().done;){let{from:r,to:a}=e.value;if((!s||He(s,n,r,a))&&(i.empty&&r<=i.from&&a>=i.to?c.push(Ve.range(r,a)):(r>=i.to||a<=i.from)&&c.push(Be.range(r,a)),c.length>t.maxMatches))return o.none}}return o.set(c)}},{decorations:e=>e.decorations}),Ge=a.baseTheme({".cm-selectionMatch":{backgroundColor:`#99ff7780`},".cm-searchMatch .cm-selectionMatch":{backgroundColor:`transparent`}}),Ke=({state:e,dispatch:t})=>{let{selection:n}=e,r=y.create(n.ranges.map(t=>e.wordAt(t.head)||y.cursor(t.head)),n.mainIndex);return r.eq(n)?!1:(t(e.update({selection:r})),!0)};function qe(e,t){let{main:n,ranges:r}=e.selection,i=e.wordAt(n.head),a=i&&i.from==n.from&&i.to==n.to;for(let n=!1,i=new S(e.doc,t,r[r.length-1].to);;)if(i.next(),i.done){if(n)return null;i=new S(e.doc,t,0,Math.max(0,r[r.length-1].from-1)),n=!0}else{if(n&&r.some(e=>e.from==i.value.from))continue;if(a){let t=e.wordAt(i.value.from);if(!t||t.from!=i.value.from||t.to!=i.value.to)continue}return i.value}}var Je=({state:e,dispatch:t})=>{let{ranges:n}=e.selection;if(n.some(e=>e.from===e.to))return Ke({state:e,dispatch:t});let r=e.sliceDoc(n[0].from,n[0].to);if(e.selection.ranges.some(t=>e.sliceDoc(t.from,t.to)!=r))return!1;let i=qe(e,r);return i?(t(e.update({selection:e.selection.addRange(y.range(i.from,i.to),!1),effects:a.scrollIntoView(i.to)})),!0):!1},D=ie.define({combine(e){return d(e,{top:!1,caseSensitive:!1,literal:!1,regexp:!1,wholeWord:!1,createPanel:e=>new ht(e),scrollToMatch:e=>a.scrollIntoView(e)})}});function Ye(e){return e?[D.of(e),K]:K}var Xe=class{constructor(e){this.search=e.search,this.caseSensitive=!!e.caseSensitive,this.literal=!!e.literal,this.regexp=!!e.regexp,this.replace=e.replace||``,this.valid=!!this.search&&(!this.regexp||Fe(this.search)),this.unquoted=this.unquote(this.search),this.wholeWord=!!e.wholeWord,this.test=e.test}unquote(e){return this.literal?e:e.replace(/\\([nrt\\])/g,(e,t)=>t==`n`?`
`:t==`r`?`\r`:t==`t`?`	`:`\\`)}eq(e){return this.search==e.search&&this.replace==e.replace&&this.caseSensitive==e.caseSensitive&&this.regexp==e.regexp&&this.wholeWord==e.wholeWord&&this.test==e.test}create(){return this.regexp?new rt(this):new et(this)}getCursor(e,t=0,n){let i=e.doc?e:r.create({doc:e});return n??=i.doc.length,this.regexp?k(this,i,t,n):O(this,i,t,n)}},Ze=class{constructor(e){this.spec=e}};function Qe(e,t,n){return(r,i,a,o)=>n&&!n(r,i,a,o)?!1:e(r>=o&&i<=o+a.length?a.slice(r-o,i-o):t.doc.sliceString(r,i),t,r,i)}function O(e,t,n,r){let i;return e.wholeWord&&(i=$e(t.doc,t.charCategorizer(t.selection.main.head))),e.test&&(i=Qe(e.test,t,i)),new S(t.doc,e.unquoted,n,r,e.caseSensitive?void 0:e=>e.toLowerCase(),i)}function $e(e,t){return(n,r,i,a)=>((a>n||a+i.length<r)&&(a=Math.max(0,n-2),i=e.sliceString(a,Math.min(e.length,r+2))),(t(A(i,n-a))!=g.Word||t(j(i,n-a))!=g.Word)&&(t(j(i,r-a))!=g.Word||t(A(i,r-a))!=g.Word))}var et=class extends Ze{constructor(e){super(e)}nextMatch(e,t,n){let r=O(this.spec,e,n,e.doc.length).nextOverlapping();if(r.done){let n=Math.min(e.doc.length,t+this.spec.unquoted.length);r=O(this.spec,e,0,n).nextOverlapping()}return r.done||r.value.from==t&&r.value.to==n?null:r.value}prevMatchInRange(e,t,n){for(let r=n;;){let n=Math.max(t,r-1e4-this.spec.unquoted.length),i=O(this.spec,e,n,r),a=null;for(;!i.nextOverlapping().done;)a=i.value;if(a)return a;if(n==t)return null;r-=1e4}}prevMatch(e,t,n){let r=this.prevMatchInRange(e,0,t);return r||=this.prevMatchInRange(e,Math.max(0,n-this.spec.unquoted.length),e.doc.length),r&&(r.from!=t||r.to!=n)?r:null}getReplacement(e){return this.spec.unquote(this.spec.replace)}matchAll(e,t){let n=O(this.spec,e,0,e.doc.length),r=[];for(;!n.next().done;){if(r.length>=t)return null;r.push(n.value)}return r}highlight(e,t,n,r){let i=O(this.spec,e,Math.max(0,t-this.spec.unquoted.length),Math.min(n+this.spec.unquoted.length,e.doc.length));for(;!i.next().done;)r(i.value.from,i.value.to)}};function tt(e,t,n){return(r,i,a)=>(!n||n(r,i,a))&&e(a[0],t,r,i)}function k(e,t,n,r){let i;return e.wholeWord&&(i=nt(t.charCategorizer(t.selection.main.head))),e.test&&(i=tt(e.test,t,i)),new Me(t.doc,e.search,{ignoreCase:!e.caseSensitive,test:i},n,r)}function A(e,t){return e.slice(oe(e,t,!1),t)}function j(e,t){return e.slice(t,oe(e,t))}function nt(e){return(t,n,r)=>!r[0].length||(e(A(r.input,r.index))!=g.Word||e(j(r.input,r.index))!=g.Word)&&(e(j(r.input,r.index+r[0].length))!=g.Word||e(A(r.input,r.index+r[0].length))!=g.Word)}var rt=class extends Ze{nextMatch(e,t,n){let r=k(this.spec,e,n,e.doc.length).next();return r.done&&(r=k(this.spec,e,0,t).next()),r.done?null:r.value}prevMatchInRange(e,t,n){for(let r=1;;r++){let i=Math.max(t,n-r*1e4),a=k(this.spec,e,i,n),o=null;for(;!a.next().done;)o=a.value;if(o&&(i==t||o.from>i+10))return o;if(i==t)return null}}prevMatch(e,t,n){return this.prevMatchInRange(e,0,t)||this.prevMatchInRange(e,n,e.doc.length)}getReplacement(e){return this.spec.unquote(this.spec.replace).replace(/\$([$&]|\d+)/g,(t,n)=>{if(n==`&`)return e.match[0];if(n==`$`)return`$`;for(let t=n.length;t>0;t--){let r=+n.slice(0,t);if(r>0&&r<e.match.length)return e.match[r]+n.slice(t)}return t})}matchAll(e,t){let n=k(this.spec,e,0,e.doc.length),r=[];for(;!n.next().done;){if(r.length>=t)return null;r.push(n.value)}return r}highlight(e,t,n,r){let i=k(this.spec,e,Math.max(0,t-250),Math.min(n+250,e.doc.length));for(;!i.next().done;)r(i.value.from,i.value.to)}},M=v.define(),N=v.define(),P=c.define({create(e){return new F(B(e).create(),null)},update(e,t){for(let n of t.effects)n.is(M)?e=new F(n.value.create(),e.panel):n.is(N)&&(e=new F(e.query,n.value?z:null));return e},provide:e=>u.from(e,e=>e.panel)}),F=class{constructor(e,t){this.query=e,this.panel=t}},it=o.mark({class:`cm-searchMatch`}),at=o.mark({class:`cm-searchMatch cm-searchMatch-selected`}),ot=ee.fromClass(class{constructor(e){this.view=e,this.decorations=this.highlight(e.state.field(P))}update(e){let t=e.state.field(P);(t!=e.startState.field(P)||e.docChanged||e.selectionSet||e.viewportChanged)&&(this.decorations=this.highlight(t))}highlight({query:e,panel:t}){if(!t||!e.spec.valid)return o.none;let{view:n}=this,r=new re;for(let t=0,i=n.visibleRanges,a=i.length;t<a;t++){let{from:o,to:s}=i[t];for(;t<a-1&&s>i[t+1].from-500;)s=i[++t].to;e.highlight(n.state,o,s,(e,t)=>{let i=n.state.selection.ranges.some(n=>n.from==e&&n.to==t);r.add(e,t,i?at:it)})}return r.finish()}},{decorations:e=>e.decorations});function I(e){return t=>{let n=t.state.field(P,!1);return n&&n.query.spec.valid?e(t,n):ft(t)}}var L=I((e,{query:t})=>{let{to:n}=e.state.selection.main,r=t.nextMatch(e.state,n,n);if(!r)return!1;let i=y.single(r.from,r.to),a=e.state.facet(D);return e.dispatch({selection:i,effects:[G(e,r),a.scrollToMatch(i.main,e)],userEvent:`select.search`}),dt(e),!0}),R=I((e,{query:t})=>{let{state:n}=e,{from:r}=n.selection.main,i=t.prevMatch(n,r,r);if(!i)return!1;let a=y.single(i.from,i.to),o=e.state.facet(D);return e.dispatch({selection:a,effects:[G(e,i),o.scrollToMatch(a.main,e)],userEvent:`select.search`}),dt(e),!0}),st=I((e,{query:t})=>{let n=t.matchAll(e.state,1e3);return!n||!n.length?!1:(e.dispatch({selection:y.create(n.map(e=>y.range(e.from,e.to))),userEvent:`select.search.matches`}),!0)}),ct=({state:e,dispatch:t})=>{let n=e.selection;if(n.ranges.length>1||n.main.empty)return!1;let{from:r,to:i}=n.main,a=[],o=0;for(let t=new S(e.doc,e.sliceDoc(r,i));!t.next().done;){if(a.length>1e3)return!1;t.value.from==r&&(o=a.length),a.push(y.range(t.value.from,t.value.to))}return t(e.update({selection:y.create(a,o),userEvent:`select.search.matches`})),!0},lt=I((e,{query:t})=>{let{state:n}=e,{from:r,to:i}=n.selection.main;if(n.readOnly)return!1;let o=t.nextMatch(n,r,r);if(!o)return!1;let s=o,c=[],l,u,d=[];s.precise?s.from==r&&s.to==i&&(u=n.toText(t.getReplacement(s)),c.push({from:s.from,to:s.to,insert:u}),s=t.nextMatch(n,s.from,s.to),d.push(a.announce.of(n.phrase(`replaced match on line $`,n.doc.lineAt(r).number)+`.`))):s=t.nextMatch(n,s.from,s.to);let f=e.state.changes(c);return s&&(l=y.single(s.from,s.to).map(f),d.push(G(e,s)),d.push(n.facet(D).scrollToMatch(l.main,e))),e.dispatch({changes:f,selection:l,effects:d,userEvent:`input.replace`}),!0}),ut=I((e,{query:t})=>{if(e.state.readOnly)return!1;let n=[];for(let r of t.matchAll(e.state,1e9)){let{from:e,to:i,precise:a}=r;a&&n.push({from:e,to:i,insert:t.getReplacement(r)})}if(!n.length)return!1;let r=e.state.phrase(`replaced $ matches`,n.length)+`.`;return e.dispatch({changes:n,effects:a.announce.of(r),userEvent:`input.replace.all`}),!0});function z(e){return e.state.facet(D).createPanel(e)}function B(e,t){let n=e.selection.main,r=n.empty||n.to>n.from+100?``:e.sliceDoc(n.from,n.to);if(t&&!r)return t;let i=e.facet(D);return new Xe({search:t?.literal??i.literal?r:r.replace(/\n/g,`\\n`),caseSensitive:t?.caseSensitive??i.caseSensitive,literal:t?.literal??i.literal,regexp:t?.regexp??i.regexp,wholeWord:t?.wholeWord??i.wholeWord})}function V(e){let t=n(e,z);return t&&t.dom.querySelector(`[main-field]`)}function dt(e){let t=V(e);t&&t==e.root.activeElement&&t.select()}var ft=e=>{let t=e.state.field(P,!1);if(t&&t.panel){let n=V(e);if(n&&n!=e.root.activeElement){let r=B(e.state,t.query.spec);r.valid&&e.dispatch({effects:M.of(r)}),n.focus(),n.select()}}else e.dispatch({effects:[N.of(!0),t?M.of(B(e.state,t.query.spec)):v.appendConfig.of(K)]});return!0},pt=e=>{let t=e.state.field(P,!1);if(!t||!t.panel)return!1;let r=n(e,z);return r&&r.dom.contains(e.root.activeElement)&&e.focus(),e.dispatch({effects:N.of(!1)}),!0},mt=[{key:`Mod-f`,run:ft,scope:`editor search-panel`},{key:`F3`,run:L,shift:R,scope:`editor search-panel`,preventDefault:!0},{key:`Mod-g`,run:L,shift:R,scope:`editor search-panel`,preventDefault:!0},{key:`Escape`,run:pt,scope:`editor search-panel`},{key:`Mod-Shift-l`,run:ct},{key:`Mod-Alt-g`,run:Ie},{key:`Mod-d`,run:Je,preventDefault:!0}],ht=class{constructor(e){this.view=e;let t=this.query=e.state.field(P).query.spec;this.commit=this.commit.bind(this),this.searchField=p(`input`,{value:t.search,placeholder:H(e,`Find`),"aria-label":H(e,`Find`),class:`cm-textfield`,name:`search`,form:``,"main-field":`true`,onchange:this.commit,onkeyup:this.commit}),this.replaceField=p(`input`,{value:t.replace,placeholder:H(e,`Replace`),"aria-label":H(e,`Replace`),class:`cm-textfield`,name:`replace`,form:``,onchange:this.commit,onkeyup:this.commit}),this.caseField=p(`input`,{type:`checkbox`,name:`case`,form:``,checked:t.caseSensitive,onchange:this.commit}),this.reField=p(`input`,{type:`checkbox`,name:`re`,form:``,checked:t.regexp,onchange:this.commit}),this.wordField=p(`input`,{type:`checkbox`,name:`word`,form:``,checked:t.wholeWord,onchange:this.commit});function n(e,t,n){return p(`button`,{class:`cm-button`,name:e,onclick:t,type:`button`},n)}this.dom=p(`div`,{onkeydown:e=>this.keydown(e),class:`cm-search`},[this.searchField,n(`next`,()=>L(e),[H(e,`next`)]),n(`prev`,()=>R(e),[H(e,`previous`)]),n(`select`,()=>st(e),[H(e,`all`)]),p(`label`,null,[this.caseField,H(e,`match case`)]),p(`label`,null,[this.reField,H(e,`regexp`)]),p(`label`,null,[this.wordField,H(e,`by word`)]),...e.state.readOnly?[]:[p(`br`),this.replaceField,n(`replace`,()=>lt(e),[H(e,`replace`)]),n(`replaceAll`,()=>ut(e),[H(e,`replace all`)])],p(`button`,{name:`close`,onclick:()=>pt(e),"aria-label":H(e,`close`),type:`button`},[`×`])])}commit(){let e=new Xe({search:this.searchField.value,caseSensitive:this.caseField.checked,regexp:this.reField.checked,wholeWord:this.wordField.checked,replace:this.replaceField.value});e.eq(this.query)||(this.query=e,this.view.dispatch({effects:M.of(e)}))}keydown(e){te(this.view,e,`search-panel`)?e.preventDefault():e.keyCode==13&&e.target==this.searchField?(e.preventDefault(),(e.shiftKey?R:L)(this.view)):e.keyCode==13&&e.target==this.replaceField&&(e.preventDefault(),lt(this.view))}update(e){for(let t of e.transactions)for(let e of t.effects)e.is(M)&&!e.value.eq(this.query)&&this.setQuery(e.value)}setQuery(e){this.query=e,this.searchField.value=e.search,this.replaceField.value=e.replace,this.caseField.checked=e.caseSensitive,this.reField.checked=e.regexp,this.wordField.checked=e.wholeWord}mount(){this.searchField.select()}get pos(){return 80}get top(){return this.view.state.facet(D).top}};function H(e,t){return e.state.phrase(t)}var U=30,W=/[\s\.,:;?!]/;function G(e,{from:t,to:n}){let r=e.state.doc.lineAt(t),i=e.state.doc.lineAt(n).to,o=Math.max(r.from,t-U),s=Math.min(i,n+U),c=e.state.sliceDoc(o,s);if(o!=r.from){for(let e=0;e<U;e++)if(!W.test(c[e+1])&&W.test(c[e])){c=c.slice(e);break}}if(s!=i){for(let e=c.length-1;e>c.length-U;e--)if(!W.test(c[e-1])&&W.test(c[e])){c=c.slice(0,e);break}}return a.announce.of(`${e.state.phrase(`current match`)}. ${c} ${e.state.phrase(`on line`)} ${r.number}.`)}var gt=a.baseTheme({".cm-panel.cm-search":{padding:`2px 6px 4px`,position:`relative`,"& [name=close]":{position:`absolute`,top:`0`,right:`4px`,backgroundColor:`inherit`,border:`none`,font:`inherit`,padding:0,margin:0},"& input, & button, & label":{margin:`.2em .6em .2em 0`},"& input[type=checkbox]":{marginRight:`.2em`},"& label":{fontSize:`80%`,whiteSpace:`pre`}},"&light .cm-searchMatch":{backgroundColor:`#ffff0054`},"&dark .cm-searchMatch":{backgroundColor:`#00ffff8a`},"&light .cm-searchMatch-selected":{backgroundColor:`#ff6a0054`},"&dark .cm-searchMatch-selected":{backgroundColor:`#ff00ff8a`}}),K=[P,l.low(ot),gt],_t=ke({String:_.string,Number:_.number,"True False":_.bool,PropertyName:_.propertyName,Null:_.null,", :":_.separator,"[ ]":_.squareBracket,"{ }":_.brace}),vt=he.deserialize({version:14,states:"$bOVQPOOOOQO'#Cb'#CbOnQPO'#CeOvQPO'#ClOOQO'#Cr'#CrQOQPOOOOQO'#Cg'#CgO}QPO'#CfO!SQPO'#CtOOQO,59P,59PO![QPO,59PO!aQPO'#CuOOQO,59W,59WO!iQPO,59WOVQPO,59QOqQPO'#CmO!nQPO,59`OOQO1G.k1G.kOVQPO'#CnO!vQPO,59aOOQO1G.r1G.rOOQO1G.l1G.lOOQO,59X,59XOOQO-E6k-E6kOOQO,59Y,59YOOQO-E6l-E6l",stateData:`#O~OeOS~OQSORSOSSOTSOWQO_ROgPO~OVXOgUO~O^[O~PVO[^O~O]_OVhX~OVaO~O]bO^iX~O^dO~O]_OVha~O]bO^ia~O`,goto:"!kjPPPPPPkPPkqwPPPPk{!RPPP!XP!e!hXSOR^bQWQRf_TVQ_Q`WRg`QcZRicQTOQZRQe^RhbRYQR]R",nodeNames:`⚠ JsonText True False Null Number String } { Object Property PropertyName : , ] [ Array`,maxTerm:25,nodeProps:[[`isolate`,-2,6,11,``],[`openedBy`,7,`{`,14,`[`],[`closedBy`,8,`}`,15,`]`]],propSources:[_t],skippedNodes:[0],repeatNodeCount:2,tokenData:"(|~RaXY!WYZ!W]^!Wpq!Wrs!]|}$u}!O$z!Q!R%T!R![&c![!]&t!}#O&y#P#Q'O#Y#Z'T#b#c'r#h#i(Z#o#p(r#q#r(w~!]Oe~~!`Wpq!]qr!]rs!xs#O!]#O#P!}#P;'S!];'S;=`$o<%lO!]~!}Og~~#QXrs!]!P!Q!]#O#P!]#U#V!]#Y#Z!]#b#c!]#f#g!]#h#i!]#i#j#m~#pR!Q![#y!c!i#y#T#Z#y~#|R!Q![$V!c!i$V#T#Z$V~$YR!Q![$c!c!i$c#T#Z$c~$fR!Q![!]!c!i!]#T#Z!]~$rP;=`<%l!]~$zO]~~$}Q!Q!R%T!R![&c~%YRT~!O!P%c!g!h%w#X#Y%w~%fP!Q![%i~%nRT~!Q![%i!g!h%w#X#Y%w~%zR{|&T}!O&T!Q![&Z~&WP!Q![&Z~&`PT~!Q![&Z~&hST~!O!P%c!Q![&c!g!h%w#X#Y%w~&yO[~~'OO_~~'TO^~~'WP#T#U'Z~'^P#`#a'a~'dP#g#h'g~'jP#X#Y'm~'rOR~~'uP#i#j'x~'{P#`#a(O~(RP#`#a(U~(ZOS~~(^P#f#g(a~(dP#i#j(g~(jP#X#Y(m~(rOQ~~(wOW~~(|OV~",tokenizers:[0],topRules:{JsonText:[0,1]},tokenPrec:0}),yt=me.define({name:`json`,parser:vt.configure({props:[Ae.add({Object:Oe({except:/^\s*\}/}),Array:Oe({except:/^\s*\]/})}),le.add({"Object Array":je})]}),languageData:{closeBrackets:{brackets:[`[`,`{`,`"`]},indentOnInput:/^\s*[\}\]]$/}});function bt(){return new pe(yt)}var q=t(),xt=ye.define([{tag:[_.keyword,_.moduleKeyword],color:`var(--ide-kw)`},{tag:[_.string,_.special(_.string)],color:`var(--ide-str)`},{tag:[_.number,_.bool,_.null],color:`var(--ide-num)`},{tag:[_.comment,_.lineComment,_.blockComment],color:`var(--ide-cmt)`,fontStyle:`italic`},{tag:[_.typeName,_.className,_.namespace],color:`var(--ide-type)`},{tag:[_.function(_.variableName),_.function(_.propertyName)],color:`var(--ide-fn)`},{tag:[_.propertyName,_.attributeName],color:`var(--ide-prop)`},{tag:[_.tagName,_.angleBracket],color:`var(--ide-tag)`},{tag:[_.operator,_.punctuation,_.separator],color:`var(--ide-punc)`},{tag:[_.definition(_.variableName),_.variableName],color:`var(--ide-text)`}]);function St(e){return/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(e)?[we({typescript:/\.tsx?$/.test(e),jsx:/x$/.test(e)})]:e.endsWith(`.css`)?[be()]:e.endsWith(`.html`)?[Ee()]:e.endsWith(`.json`)?[bt()]:[]}var Ct=a.theme({"&":{height:`100%`,fontSize:`var(--ide-code-size)`,color:`var(--ide-text)`},".cm-scroller":{fontFamily:`var(--ide-mono)`,lineHeight:`1.55`,paddingBottom:`40vh`},".cm-content":{caretColor:`var(--ide-accent)`},".cm-gutters":{background:`var(--ide-panel)`,color:`var(--ide-faint)`,border:`none`,minWidth:`2.2em`},".cm-activeLine":{background:`var(--ide-active)`},".cm-activeLineGutter":{background:`var(--ide-active)`,color:`var(--ide-dim)`},"&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection":{background:`var(--ide-selection)`},".cm-cursor, .cm-dropCursor":{borderLeftColor:`var(--ide-accent)`,borderLeftWidth:`2px`},".cm-selectionMatch":{background:`var(--ide-match)`},".cm-matchingBracket, &.cm-focused .cm-matchingBracket":{background:`var(--ide-match)`,outline:`1px solid var(--ide-hairline)`},".cm-panels":{background:`var(--ide-panel)`,color:`var(--ide-text)`},".cm-panels input, .cm-panels button":{background:`var(--ide-bg)`,color:`var(--ide-text)`,border:`1px solid var(--ide-hairline)`,borderRadius:`6px`,padding:`4px 7px`},".cm-searchMatch":{background:`var(--ide-match)`},".cm-searchMatch-selected":{background:`var(--ide-accent)`,color:`#06121b`}},{dark:!0});function wt({path:e,initialText:t,onChange:n,onReady:o}){let s=(0,b.useRef)(null),c=(0,b.useRef)(n);c.current=n;let l=(0,b.useRef)(o);return l.current=o,(0,b.useEffect)(()=>{if(!s.current)return;let n=new a({state:r.create({doc:t,extensions:[h(),ue(),ge(),ze(),se(),ce(),ne(),Ye({top:!0}),i(xt),a.lineWrapping,m.of([...xe,...Te,...ve,...mt,de]),St(e),Ct,a.updateListener.of(e=>{e.docChanged&&c.current(e.state.doc.toString())})]}),parent:s.current});return l.current(n),()=>n.destroy()},[e]),(0,q.jsx)(`div`,{className:`ide-editor`,ref:s})}function Tt(e){let t=e.lastIndexOf(`/`);return t===-1?`/`:e.slice(0,t)}function Et(e){return e.slice(e.lastIndexOf(`/`)+1)}function Dt({paths:e,current:t,dirty:n,onPick:r}){let[i,a]=(0,b.useState)(``),o=(0,b.useMemo)(()=>{let t=i.trim().toLowerCase(),n=t?e.filter(e=>e.toLowerCase().includes(t)):e,r=new Map;for(let e of n){let t=Tt(e),n=r.get(t);n?n.push(e):r.set(t,[e])}return[...r.entries()]},[e,i]);return(0,q.jsxs)(`div`,{className:`ide-tree`,children:[(0,q.jsx)(`div`,{className:`ide-tree__search`,children:(0,q.jsx)(`input`,{className:`ide-tree__input`,type:`search`,inputMode:`search`,autoCapitalize:`none`,autoCorrect:`off`,spellCheck:!1,placeholder:`Filter files`,value:i,onChange:e=>a(e.target.value),"aria-label":`Filter files`})}),(0,q.jsxs)(`div`,{className:`ide-tree__scroll`,children:[o.length===0&&(0,q.jsxs)(`p`,{className:`ide-tree__empty`,children:[`No files match “`,i,`”.`]}),o.map(([e,i])=>(0,q.jsxs)(`section`,{className:`ide-tree__group`,children:[(0,q.jsx)(`h3`,{className:`ide-tree__dir`,children:e}),i.map(e=>(0,q.jsxs)(`button`,{type:`button`,className:`ide-tree__file${e===t?` ide-tree__file--on`:``}`,onClick:()=>r(e),"aria-current":e===t||void 0,children:[(0,q.jsx)(`span`,{className:`ide-tree__name`,children:Et(e)}),n(e)&&(0,q.jsx)(`span`,{className:`ide-tree__dot`,"aria-label":`Edited`})]},e))]},e))]})]})}var Ot=`{}()[]<>/=;:.,'"\`$_-+|&!?*#@`.split(``);function kt({view:e}){let t=t=>{if(!e)return;let{from:n,to:r}=e.state.selection.main;e.dispatch({changes:{from:n,to:r,insert:t},selection:{anchor:n+t.length},scrollIntoView:!0}),e.focus()},n=t=>{e&&(t(e),e.focus())};return(0,q.jsxs)(`div`,{className:`ide-keybar`,role:`toolbar`,"aria-label":`Code symbols`,children:[(0,q.jsx)(`button`,{type:`button`,className:`ide-keybar__key ide-keybar__key--wide`,"aria-label":`Undo`,onPointerDown:e=>{e.preventDefault(),n(Se)},children:`↶`}),(0,q.jsx)(`button`,{type:`button`,className:`ide-keybar__key ide-keybar__key--wide`,"aria-label":`Redo`,onPointerDown:e=>{e.preventDefault(),n(fe)},children:`↷`}),(0,q.jsx)(`button`,{type:`button`,className:`ide-keybar__key ide-keybar__key--wide`,"aria-label":`Indent`,onPointerDown:e=>{e.preventDefault(),n(De)},children:`⇥`}),(0,q.jsx)(`span`,{className:`ide-keybar__sep`}),Ot.map(e=>(0,q.jsx)(`button`,{type:`button`,className:`ide-keybar__key`,"aria-label":`Insert ${e}`,onPointerDown:n=>{n.preventDefault(),t(e)},children:e},e))]})}function At(e){(0,b.useEffect)(()=>{let t=window.visualViewport,n=e.current;if(!t||!n)return;let r=0,i=()=>{cancelAnimationFrame(r),r=requestAnimationFrame(()=>{let e=window.innerHeight-t.height-t.offsetTop;n.style.setProperty(`--ide-kb`,e>60?`${Math.round(e)}px`:`0px`)})};return i(),t.addEventListener(`resize`,i),t.addEventListener(`scroll`,i),()=>{cancelAnimationFrame(r),t.removeEventListener(`resize`,i),t.removeEventListener(`scroll`,i),n.style.removeProperty(`--ide-kb`)}},[e])}var J={".oxlintrc.json":`{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
`,"AGENTS.md":`# Working on Find

Find is a **Shell** that hosts several self-contained **Apps**. Read
[CONTEXT.md](./CONTEXT.md) for the vocabulary before changing anything.

The design rule behind everything here: **adding an App must not disturb the
Apps already there.** Prefer a change that touches one folder over a clever one
that touches many.

## Adding an App

1. Create \`src/apps/<id>/\`.
2. Give it an \`index.tsx\` whose **default export** is the App's root component,
   and which imports the App's own CSS:

   \`\`\`tsx
   import './my-app.css'
   import MyApp from './MyApp'
   export default MyApp
   \`\`\`

3. Add one entry to \`registry\` in \`src/shell/registry.ts\`:

   \`\`\`ts
   {
     id: 'my-app',
     name: 'My App',
     description: 'One line, shown on the Home tile',
     icon: MyAppIcon,          // declared in registry.ts, not in the App
     accent: '#7dd3fc',        // tints the App's Home tile
     load: () => import('../apps/my-app'),
   }
   \`\`\`

That is the whole procedure. Do not edit \`Shell.tsx\`, \`Home.tsx\`, \`router.ts\`,
or any other App.

## Rules an App must follow

- **Namespace every class name.** Pick a short prefix (\`lc-\`, \`devices-\`) and
  use it on every selector, including the root element. Apps share one document;
  a bare \`.row\` or \`.header\` will collide with the next App.
- **Scope your tokens to your root class**, not \`:root\`. See
  \`src/apps/devices/palette.css\`.
- **Declare the icon in \`registry.ts\`, not in your App.** Importing it from the
  App would pull the App's whole chunk into the initial bundle and defeat lazy
  loading.
- **Assume nothing about the Shell.** Apps import nothing from \`src/shell/\`. The
  Shell passes no props, no storage, no navigation handle.
- **Clean up on unmount.** The Shell unmounts an App when you leave it, so
  return teardown from every \`useEffect\` that starts a watch, timer or socket.
  A leaked sensor runs behind another App's UI.
- **Treat ≥880px as the tablet breakpoint** if you have two postures. It is a
  convention, not a token — CSS custom properties cannot be used in media
  queries.

## What the Shell gives you

Only two things, both inherited automatically:

- **A container.** \`.shell-host\` is a fixed, contained box below the Shell bar.
  It is a containing block for \`position: fixed\` descendants, so \`inset: 0\`
  inside your App fills the host rather than the viewport. Your z-indexes cannot
  escape it, so use whatever values you like.
- **Device tokens.** \`--safe-t\`, \`--safe-b\`, \`--safe-l\`, \`--safe-r\` from
  \`src/shell/tokens.css\`, plus the reset and the reduced-motion clamp in
  \`src/shell/reset.css\`. **Use the safe-area tokens** on anything pinned to a
  screen edge, or it will sit under the notch on an installed PWA.

Everything else — colour, type, radii, shadows, motion — is yours.

## Offline

Only the Shell is precached. An App's chunk is cached by the service worker the
first time that App is opened, so installing Find stays cheap however many Apps
exist, and an App the user has never opened will not work offline. You need do
nothing to opt in — the caching rule matches any hashed asset, so a new App is
covered automatically.

## The one exception to "one folder plus one Registry entry"

Some things are build-time config and cannot be expressed at runtime inside an
App. Two Apps need this today:

- **Devices** adds a \`workbox.runtimeCaching\` rule for OpenStreetMap tiles.
- **IDE** needs the repository's own source, so it ships a Vite plugin
  (\`src/apps/ide/snapshot.plugin.ts\`) exposing \`virtual:project-snapshot\`.

Keep the plugin in the App's own folder and add a single import plus one entry
in \`vite.config.ts\`, as the IDE does. That way the exception costs one line of
shared config rather than a block of app-specific logic. Label anything you add
with the App's name.

A node-side plugin must also be added to \`tsconfig.node.json\`'s \`include\` and
excluded from \`tsconfig.app.json\`, since it uses node APIs rather than DOM
ones.

## Before you push

\`\`\`bash
npm run build   # tsc -b + vite build
npm run lint    # oxlint
npm run preview # serves at http://localhost:4173/find/
\`\`\`

Check the App at phone width (390px) **and** tablet width (1024px), and confirm
the other Apps still work — the point of the Shell is that they should.
`,"CONTEXT.md":`# Find

Find is a personal workbench: one installable web app that holds several small,
self-contained apps. It exists so that adding a new app never disturbs the ones
already there.

## Language

**Shell**:
The host that owns the window — routing, the Home screen, and the reset and
device tokens every app inherits. It renders exactly one App at a time.
_Avoid_: framework, container, host app, scaffolding

**App**:
A self-contained experience living in \`src/apps/<id>/\`, reached by one Registry
entry. An App knows nothing about the Shell or about any other App.
_Avoid_: module, plugin, page, tab, mini-app

**Registry**:
The single list of Apps, in \`src/shell/registry.ts\`. Adding an App means adding
one entry here and nothing else. Distinct from the *PWA manifest*, which
describes the installed Find itself.
_Avoid_: manifest, catalogue, index

**Home**:
The Shell's app-picker screen: a grid of tiles, one per Registry entry. The
route when no App is selected.
_Avoid_: launcher, dashboard, menu, index

## The styling boundary

**Device tokens**:
CSS custom properties describing *the machine*, not taste — safe-area insets,
reduced-motion durations, the tablet breakpoint. Owned by the Shell, inherited
by every App.
_Avoid_: global tokens, base tokens, theme

**App palette**:
An App's own colours, type scale, radii and shadows, scoped to that App's
folder. Two Apps are expected to look nothing alike.
_Avoid_: theme, skin, design system

## The Apps

**Devices**:
Locates your things on a live map. Was called *Find* when it was the only app;
that name now belongs to the Shell.
_Avoid_: Find, locator, tracker

**Lifecycle**:
Traces every read, write and derivation on a JavaScript object over one run.
_Avoid_: visualizer, tracer, debugger

**IDE**:
Reads and edits this repository's own source from a phone. Edits are local to
the device and never reach the repository on their own.
_Avoid_: editor, code editor, workspace

**Sites**:
Authors small static web pages from scratch and previews them. Unlike the IDE,
which edits this repository, Sites edits content the user owns.
_Avoid_: Studio, Pages, builder

**Snapshot**:
The copy of this repository's source captured at build time and shipped inside
the IDE. It is fixed until the next deploy, so it can lag the real repository.
_Avoid_: workspace, filesystem, working copy

## Things a user makes

**Site**:
One static web page a user authors in Sites: exactly three files — markup,
styles and script — under a name they choose. Deliberately not called a
*project*; that word means this repository.
_Avoid_: project, page, website, document

**Preview**:
A Site rendered in a sandboxed frame with no access to Find's own storage. It
updates only when the user runs it, never as they type.
_Avoid_: live preview, render, output
`,"README.md":`# Find — a personal workbench

**Find** is an installable web app that holds other apps. Open it and you get a
grid of tiles; tap one and that app takes the screen. It exists so that building
a new small app never means clobbering the last one.

Four apps live here today:

| App | What it does |
| --- | --- |
| **Devices** | Locates your things on a live dark map — distance, last-seen and battery on every row. |
| **Lifecycle** | Traces every read, write, method call and derivation on a JavaScript object over one run. |
| **IDE** | Reads and edits this project's own source from a phone — syntax highlighting, a symbol row for the characters phone keyboards bury, and edits that survive leaving the app. |
| **Sites** | Write a small static web page — markup, styles and script — and run it in a sandboxed preview, with a console for its errors. Sites are stored on the device and download as one self-contained \`.html\`. |

## The idea

Adding an app is **one new folder plus one line in the registry**. Nothing else
changes — not the shell, not the router, and certainly not the other apps. That
constraint is the whole design, and everything below follows from it.

- **Apps know nothing about the shell.** No props, no SDK, no storage handle, no
  navigation. An app is a React component behind a dynamic import.
- **Apps know nothing about each other.** Each owns its palette, its type scale
  and its class-name prefix. Devices is warm amber; Lifecycle is cool slate;
  neither had to compromise.
- **The shell owns the device, apps own the look.** The shell provides a reset,
  safe-area insets and a reduced-motion clamp. Everything aesthetic belongs to
  the app.
- **Apps unmount when you leave them.** Devices runs a GPS watch; it stops the
  moment you go back to Home rather than draining battery behind a code editor.
- **Apps load lazily.** Opening Lifecycle never downloads Leaflet, and neither
  of them downloads the IDE's editor.

See [CONTEXT.md](./CONTEXT.md) for the vocabulary and
[AGENTS.md](./AGENTS.md) for how to add an app.

## Tech

- **Vite + React 19 + TypeScript**, no UI framework and no router dependency —
  hash routing is ~30 hand-rolled lines over \`popstate\`
- **Leaflet** with OpenStreetMap tiles for Devices, restyled dark via a CSS
  filter and cached by the service worker for offline use
- **CodeMirror 6** for the IDE, lazily loaded so it costs nothing until opened
- **Installable PWA** (\`vite-plugin-pwa\`) — add it to your home screen and it
  runs full-screen with safe-area insets. Only the shell is precached; each app
  is cached the first time you open it, so installing Find does not download
  every app's dependencies. An app you have never opened will not work offline.

## Run it

\`\`\`bash
npm install
npm run dev        # http://localhost:5173
\`\`\`

Open it on your phone (same network, or deploy it) and **allow location** to see
yourself on the map in Devices.

\`\`\`bash
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build at /find/
npm run lint       # oxlint
\`\`\`

> Location requires a secure context. \`localhost\` and any \`https://\` host work;
> plain-HTTP LAN IPs will not grant geolocation.

## Project layout

\`\`\`
src/
  main.tsx                mounts the Shell, registers the service worker
  shell/
    registry.ts           the single list of Apps — add an App here
    types.ts              AppEntry: id, name, description, icon, accent, load
    Shell.tsx             route → App, bar, unmount-on-leave
    Home.tsx              the tile grid
    router.ts             hash routing
    reset.css             a true reset, nothing app-specific
    tokens.css            device tokens only (safe-area insets)
    shell.css             bar, Home and App host
  apps/
    devices/              index.tsx, App.tsx, components/, hooks/, lib/,
                          store/, devices.css, palette.css
    lifecycle/            index.tsx, LifecycleApp.tsx, components/,
                          parser.ts, tracer.ts, lifecycle.css
    ide/                  index.tsx, IdeApp.tsx, workspace.ts, components/,
                          hooks/, ide.css, snapshot.plugin.ts
    sites/                index.tsx, SitesApp.tsx, store.ts, compose.ts,
                          scaffold.ts, files.ts, components/, hooks/, sites.css
\`\`\`

### The IDE's edits

The IDE ships a build-time snapshot of this repository, so it opens instantly
and works offline. Edits live in \`localStorage\` and never leave the device on
their own — there is no backend and no token. To move work off the phone, use
**⋯ → Copy patch** or **Download patch** and \`git apply\` it elsewhere. Editing a
file in the IDE does not change the running app; the snapshot is fixed until the
next deploy.

### How Sites previews safely

A Site's three files are combined into one document with \`DOMParser\`, which
copes with both a pasted full page and a bare fragment without special-casing
either. The result renders in an iframe sandboxed **without**
\`allow-same-origin\`, so the frame gets an opaque origin and a Site's script
cannot read Find's \`localStorage\` or IndexedDB — the Devices location history
and the IDE's edits live on this origin, and pasting someone else's HTML must
not hand it any of that. \`allow-top-navigation\` is off too. Forms, popups and
modals are enabled, because without them an ordinary page looks broken for
reasons the user cannot see.

Sites live in IndexedDB rather than \`localStorage\`, both because they are
content a user would be upset to lose and to keep a large Site from exhausting
the ~5MB that every other app shares. Where a browser blocks IndexedDB, Sites
runs in memory and says so up front rather than losing work silently.

Because a phone has no devtools, the preview forwards the Site's \`console.*\`
output and uncaught errors up to a console strip in the app — otherwise a broken
script just makes Run appear to do nothing. That instrumentation is injected for
the preview only; the file you download is your own code and nothing else. The
frame's origin is opaque, so messages are authenticated by source window rather
than by origin, which would just be the string \`"null"\`.

## Deploy (GitHub Pages)

\`.github/workflows/deploy.yml\` builds and publishes to a \`gh-pages\` branch on
every push. Production builds use a \`/find/\` base path; override with the
\`BASE_PATH\` env var for a custom domain or a user site.

One-time setup, then it's automatic:

1. Push the branch — the **Deploy to GitHub Pages** action builds and creates
   the \`gh-pages\` branch.
2. In the repo, go to **Settings → Pages → Build and deployment**, set
   **Source = Deploy from a branch**, choose **\`gh-pages\` / \`root\`**, and save.
3. Open \`https://<your-user>.github.io/find/\` and **Add to Home Screen**. HTTPS
   satisfies the geolocation secure-context requirement, so Devices' live map
   works.

## Going multi-device (future)

Devices stores everything in \`localStorage\`, so there is no backend and no
account — private, instant and offline-capable, but rings only sound on the
device you're holding and devices don't sync on their own. To change that you'd
replace the read/write in \`src/apps/devices/store/devices.ts\` with a small sync
service. Nothing outside that folder needs to change.
`,"index.html":`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/icon.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, viewport-fit=cover"
    />
    <meta name="theme-color" content="#0c0e11" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="Find" />
    <meta
      name="description"
      content="Find — a personal workbench of small, self-contained apps."
    />
    <title>Find</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"><\/script>
  </body>
</html>
`,"package.json":`{
  "name": "find",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "oxlint",
    "preview": "vite preview"
  },
  "dependencies": {
    "@codemirror/autocomplete": "^6.20.3",
    "@codemirror/commands": "^6.11.0",
    "@codemirror/lang-css": "^6.3.1",
    "@codemirror/lang-html": "^6.4.12",
    "@codemirror/lang-javascript": "^6.2.5",
    "@codemirror/lang-json": "^6.0.2",
    "@codemirror/language": "^6.12.4",
    "@codemirror/search": "^6.7.2",
    "@codemirror/state": "^6.7.4",
    "@codemirror/view": "^6.43.11",
    "@lezer/highlight": "^1.2.3",
    "@types/leaflet": "^1.9.21",
    "leaflet": "^1.9.4",
    "react": "^19.2.7",
    "react-dom": "^19.2.7",
    "vite-plugin-pwa": "^1.3.0"
  },
  "devDependencies": {
    "@types/node": "^24.13.2",
    "@types/react": "^19.2.17",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.2",
    "oxlint": "^1.69.0",
    "typescript": "~6.0.2",
    "vite": "^8.1.0"
  }
}
`,"src/apps/devices/App.tsx":`import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { DeviceType, GeoFix } from './types'
import { decorate } from './lib/select'
import { getCurrentFix } from './lib/geolocation'
import { buzz, playFindChime } from './lib/sound'
import { addDevice, loadMapView, removeDevice, setLost } from './store/devices'
import { useIsTablet } from './hooks/useMediaQuery'
import { useNow, useStore } from './hooks/useStore'
import { useSelfTracking } from './hooks/useSelfTracking'
import { DeviceMap, type MapHandle } from './components/DeviceMap'
import { DeviceList } from './components/DeviceList'
import { BottomSheet, PEEK_FRACTION } from './components/BottomSheet'
import { SideRail } from './components/SideRail'
import { Modal } from './components/Modal'
import { ActionSheet } from './components/ActionSheet'
import { AddSheet } from './components/AddSheet'
import { SearchPill } from './components/SearchPill'
import { LocateFab } from './components/LocateFab'
import { Toast } from './components/Toast'
import { PlusIcon } from './components/Icons'

function fallbackFix(selfFix: GeoFix | null): GeoFix {
  if (selfFix) return { ...selfFix, ts: Date.now() }
  const view = loadMapView()
  const [lat, lng] = view?.center ?? [37.7749, -122.4194]
  return { lat, lng, ts: Date.now() }
}

function openDirections(fix: GeoFix) {
  const url = \`https://www.google.com/maps/dir/?api=1&destination=\${fix.lat},\${fix.lng}\`
  window.open(url, '_blank', 'noopener,noreferrer')
}

export default function App() {
  const { permission, hasFix } = useSelfTracking()
  const state = useStore()
  const now = useNow()
  const isTablet = useIsTablet()

  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [vh, setVh] = useState(() =>
    typeof window !== 'undefined' ? window.innerHeight : 800,
  )

  const mapRef = useRef<MapHandle>(null)

  // Keep viewport-derived layout values fresh across rotation / resize.
  useEffect(() => {
    const onResize = () => setVh(window.innerHeight)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const vms = useMemo(() => decorate(state, now, query), [state, now, query])
  const selfFix = useMemo(
    () => state.devices.find((d) => d.id === state.selfId)?.lastFix ?? null,
    [state],
  )
  const selectedVm = useMemo(
    () => vms.find((v) => v.device.id === selectedId) ?? null,
    [vms, selectedId],
  )

  const bottomInset = isTablet ? 0 : Math.round(PEEK_FRACTION * vh)

  const flash = useCallback((msg: string) => setToast(msg), [])
  const closeSelected = useCallback(() => setSelectedId(null), [])
  const closeAdd = useCallback(() => setAddOpen(false), [])
  const clearToast = useCallback(() => setToast(null), [])

  const handleSelect = useCallback(
    (id: string) => {
      setSelectedId(id)
      const dev = state.devices.find((d) => d.id === id)
      if (dev?.lastFix) mapRef.current?.flyTo(dev.lastFix.lat, dev.lastFix.lng)
    },
    [state],
  )

  const handleRing = useCallback(
    (id: string) => {
      const dev = state.devices.find((d) => d.id === id)
      if (!dev) return
      if (dev.isSelf) {
        playFindChime()
        buzz()
        flash('Playing sound on this device')
      } else {
        flash(\`“\${dev.name}” can only be rung from the device itself\`)
      }
    },
    [state, flash],
  )

  const handleDirections = useCallback(
    (id: string) => {
      const dev = state.devices.find((d) => d.id === id)
      if (dev?.lastFix) openDirections(dev.lastFix)
    },
    [state],
  )

  const handleToggleLost = useCallback(
    (id: string) => {
      const dev = state.devices.find((d) => d.id === id)
      if (!dev) return
      const nextLost = dev.status !== 'lost'
      setLost(id, nextLost)
      flash(nextLost ? \`Marked “\${dev.name}” as lost\` : \`“\${dev.name}” found\`)
    },
    [state, flash],
  )

  const handleForget = useCallback(
    (id: string) => {
      const dev = state.devices.find((d) => d.id === id)
      removeDevice(id)
      setSelectedId(null)
      if (dev) flash(\`Forgot “\${dev.name}”\`)
    },
    [state, flash],
  )

  const handleLocateMe = useCallback(() => {
    if (!selfFix) {
      flash('Location is off — enable it to see yourself')
      return
    }
    mapRef.current?.flyToSelf()
  }, [selfFix, flash])

  const handleAdd = useCallback(
    async (name: string, type: DeviceType) => {
      setAddOpen(false)
      let fix: GeoFix
      try {
        fix = await getCurrentFix()
      } catch {
        fix = fallbackFix(selfFix)
      }
      addDevice({ name, type, fix })
      mapRef.current?.flyTo(fix.lat, fix.lng)
      flash(\`Added “\${name}”\`)
    },
    [selfFix, flash],
  )

  const total = state.devices.length
  const countLabel = (
    <div className="header__label">
      My devices<span className="header__count"> · {total}</span>
    </div>
  )

  const addButton = (
    <button
      className="addbtn"
      aria-label="Add a device"
      onClick={() => setAddOpen(true)}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <PlusIcon size={24} />
    </button>
  )

  const list = (
    <DeviceList
      vms={vms}
      now={now}
      selectedId={selectedId}
      onSelect={handleSelect}
      onRing={handleRing}
      emptyHint={query ? 'No devices match.' : 'No devices yet.'}
    />
  )

  const addLabel =
    permission === 'denied'
      ? 'Location off — drops at the map centre'
      : 'Using your current location'

  // The phone action sheet and (either layout's) add sheet are true overlays;
  // the tablet device detail is inline, so it does not make the base inert.
  const actionModalOpen = !isTablet && !!selectedVm && !addOpen
  const baseInert = addOpen || actionModalOpen

  return (
    <div className={\`devices-app\${isTablet ? ' devices-app--tablet' : ''}\`}>
      <div className="base" inert={baseInert || undefined}>
        <DeviceMap
          ref={mapRef}
          devices={vms}
          selfFix={selfFix}
          selectedId={selectedId}
          onSelect={handleSelect}
          bottomInset={bottomInset}
        />

        {isTablet ? (
          <SideRail>
            <div className="rail__head">
              <div className="brand">
                <span className="brand__dot" />
                Devices
              </div>
              <div className="rail__controls">
                <SearchPill value={query} onChange={setQuery} block />
                {addButton}
              </div>
              {countLabel}
            </div>
            <div className="rail__scroll">{list}</div>
            {selectedVm && (
              <div className="rail__detail">
                <button
                  className="rail__close"
                  aria-label="Close details"
                  onClick={closeSelected}
                >
                  Done
                </button>
                <ActionSheet
                  vm={selectedVm}
                  now={now}
                  onRing={handleRing}
                  onDirections={handleDirections}
                  onToggleLost={handleToggleLost}
                  onForget={handleForget}
                />
              </div>
            )}
          </SideRail>
        ) : (
          <>
            <div className="float-top">
              <SearchPill value={query} onChange={setQuery} />
            </div>
            <BottomSheet
              header={
                <div className="header">
                  {addButton}
                  {countLabel}
                </div>
              }
            >
              {list}
            </BottomSheet>
          </>
        )}

        <LocateFab
          onClick={handleLocateMe}
          disabled={!selfFix}
          bottomOffset={bottomInset + 16}
        />
      </div>

      {!isTablet && (
        <Modal
          open={!!selectedVm && !addOpen}
          onClose={closeSelected}
          variant="sheet"
          labelledBy="action-title"
        >
          {selectedVm && (
            <ActionSheet
              vm={selectedVm}
              now={now}
              onRing={handleRing}
              onDirections={handleDirections}
              onToggleLost={handleToggleLost}
              onForget={handleForget}
            />
          )}
        </Modal>
      )}

      <Modal
        open={addOpen}
        onClose={closeAdd}
        variant={isTablet ? 'card' : 'sheet'}
        labelledBy="add-title"
      >
        <AddSheet
          defaultName="New device"
          locationLabel={addLabel}
          locating={!hasFix && permission !== 'denied'}
          onAdd={handleAdd}
        />
      </Modal>

      <Toast message={toast} onDone={clearToast} />

      <div className="sr-only" role="status" aria-live="polite">
        {query
          ? \`\${vms.length} device\${vms.length === 1 ? '' : 's'} matching \${query}\`
          : ''}
      </div>
    </div>
  )
}
`,"src/apps/devices/components/ActionSheet.tsx":`import type { DeviceVM } from '../lib/select'
import { formatAge, formatDistance, freshnessColorVar } from '../lib/geo'
import { DeviceGlyph, DirectionsIcon, ForgetIcon, LostIcon, SoundIcon } from './Icons'

interface ActionSheetProps {
  vm: DeviceVM
  now: number
  onRing: (id: string) => void
  onDirections: (id: string) => void
  onToggleLost: (id: string) => void
  onForget: (id: string) => void
}

export function ActionSheet({
  vm,
  now,
  onRing,
  onDirections,
  onToggleLost,
  onForget,
}: ActionSheetProps) {
  const { device, freshness, distanceM } = vm
  const fix = device.lastFix
  const isLost = device.status === 'lost'

  const meta: string[] = []
  if (device.isSelf) meta.push('This device')
  else if (distanceM != null) meta.push(formatDistance(distanceM))
  if (fix?.place) meta.push(fix.place)
  if (fix) meta.push(formatAge(fix.ts, now))
  if (device.battery != null) meta.push(\`\${device.battery}%\`)

  const canRoute = !!fix

  return (
    <div className="action">
      <div className="action__head">
        <div
          className="action__tile"
          style={{ color: freshnessColorVar(freshness) }}
        >
          <DeviceGlyph type={device.type} size={28} />
        </div>
        <div className="action__title">
          <div className="action__name" id="action-title">
            {device.name}
            {isLost && <span className="pill pill--lost">Lost</span>}
          </div>
          <div className="action__meta tnum">
            {meta.length ? meta.join(' · ') : 'No location yet'}
          </div>
        </div>
      </div>

      <div className="action__row">
        <button
          className="act"
          disabled={!canRoute}
          onClick={() => onDirections(device.id)}
        >
          <DirectionsIcon size={22} />
          <span>Directions</span>
        </button>
        <button className="act" onClick={() => onRing(device.id)}>
          <SoundIcon size={22} />
          <span>Play sound</span>
        </button>
        {!device.isSelf && (
          <button
            className={\`act\${isLost ? ' act--active' : ''}\`}
            onClick={() => onToggleLost(device.id)}
          >
            <LostIcon size={22} />
            <span>{isLost ? 'Found' : 'Mark lost'}</span>
          </button>
        )}
      </div>

      {!device.isSelf && (
        <button className="action__forget" onClick={() => onForget(device.id)}>
          <ForgetIcon size={17} />
          Forget this device
        </button>
      )}
      {!device.isSelf && !canRoute && (
        <p className="action__note">
          This device has no location yet — it’ll appear on the map once it
          reports in.
        </p>
      )}
    </div>
  )
}
`,"src/apps/devices/components/AddSheet.tsx":`import { useEffect, useRef, useState } from 'react'
import type { DeviceType } from '../types'
import { guessType } from '../lib/geo'
import { DeviceGlyph } from './Icons'

interface AddSheetProps {
  defaultName: string
  locationLabel: string
  locating: boolean
  onAdd: (name: string, type: DeviceType) => void
}

const TYPES: { type: DeviceType; label: string }[] = [
  { type: 'phone', label: 'Phone' },
  { type: 'tablet', label: 'Tablet' },
  { type: 'laptop', label: 'Laptop' },
  { type: 'headphones', label: 'Buds' },
  { type: 'watch', label: 'Watch' },
  { type: 'tracker', label: 'Tag' },
  { type: 'other', label: 'Other' },
]

export function AddSheet({ defaultName, locationLabel, locating, onAdd }: AddSheetProps) {
  const [name, setName] = useState('')
  const [manualType, setManualType] = useState<DeviceType | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Open with the keyboard already up — no field tap needed.
    const id = setTimeout(() => inputRef.current?.focus(), 60)
    return () => clearTimeout(id)
  }, [])

  const effectiveType = manualType ?? guessType(name || defaultName)
  const finalName = name.trim() || defaultName

  const submit = () => onAdd(finalName, effectiveType)

  return (
    <div className="add">
      <h2 className="add__title" id="add-title">
        Add a device
      </h2>

      <div className="add__field">
        <div className="add__glyph" style={{ color: 'var(--beacon)' }}>
          <DeviceGlyph type={effectiveType} size={26} />
        </div>
        <input
          ref={inputRef}
          className="add__input"
          value={name}
          placeholder={defaultName}
          enterKeyHint="done"
          autoComplete="off"
          aria-label="Device name"
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit()
          }}
        />
      </div>

      <div className="add__types" role="group" aria-label="Device type">
        {TYPES.map((t) => (
          <button
            key={t.type}
            className={\`typechip\${effectiveType === t.type ? ' typechip--on' : ''}\`}
            aria-pressed={effectiveType === t.type}
            onClick={() => setManualType(t.type)}
          >
            <DeviceGlyph type={t.type} size={18} />
            {t.label}
          </button>
        ))}
      </div>

      <div className="add__loc">
        <span className="dot" style={{ background: 'var(--mint)' }} aria-hidden="true" />
        {locating ? 'Finding your location…' : locationLabel}
      </div>

      <button className="add__cta" onClick={submit}>
        Add here
      </button>
    </div>
  )
}
`,"src/apps/devices/components/BottomSheet.tsx":`import { useEffect, useRef, useState, type ReactNode } from 'react'

export const PEEK_FRACTION = 0.42
export const EXPANDED_FRACTION = 0.88

interface BottomSheetProps {
  /** Header content (e.g. label + add button); also a drag affordance. */
  header: ReactNode
  children: ReactNode
}

/**
 * Phone-only draggable sheet with two snap points (peek / expanded).
 * Tapping the handle toggles; dragging it snaps to the nearest point.
 */
export function BottomSheet({ header, children }: BottomSheetProps) {
  const [vh, setVh] = useState(() =>
    typeof window !== 'undefined' ? window.innerHeight : 800,
  )
  const [expanded, setExpanded] = useState(false)
  const [drag, setDrag] = useState<number | null>(null)
  const startY = useRef(0)
  const startTranslate = useRef(0)
  const moved = useRef(false)

  useEffect(() => {
    const onResize = () => setVh(window.innerHeight)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const collapsed = (EXPANDED_FRACTION - PEEK_FRACTION) * vh
  const snapTranslate = expanded ? 0 : collapsed
  const translate = drag ?? snapTranslate

  const onPointerDown = (e: React.PointerEvent) => {
    startY.current = e.clientY
    startTranslate.current = snapTranslate
    moved.current = false
    setDrag(snapTranslate)
    ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (drag == null) return
    const next = startTranslate.current + (e.clientY - startY.current)
    if (Math.abs(e.clientY - startY.current) > 4) moved.current = true
    setDrag(Math.min(collapsed, Math.max(0, next)))
  }
  const onPointerUp = () => {
    if (drag == null) return
    if (!moved.current) {
      // A tap toggles between peek and expanded.
      setExpanded((v) => !v)
    } else {
      setExpanded(drag < collapsed / 2)
    }
    setDrag(null)
  }

  return (
    <section
      className="sheet"
      style={{
        height: \`\${EXPANDED_FRACTION * 100}vh\`,
        transform: \`translateY(\${translate}px)\`,
        transition: drag == null ? undefined : 'none',
      }}
      aria-label="Your devices"
    >
      <div
        className="sheet__handle"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="button"
        tabIndex={0}
        aria-label={expanded ? 'Collapse list' : 'Expand list'}
        aria-expanded={expanded}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setExpanded((v) => !v)
          }
        }}
      >
        <span className="grabber" />
        {header}
      </div>
      <div className="sheet__scroll">{children}</div>
    </section>
  )
}
`,"src/apps/devices/components/DeviceList.tsx":`import type { DeviceVM } from '../lib/select'
import { DeviceRow } from './DeviceRow'

interface DeviceListProps {
  vms: DeviceVM[]
  now: number
  selectedId: string | null
  onSelect: (id: string) => void
  onRing: (id: string) => void
  emptyHint: string
}

export function DeviceList({
  vms,
  now,
  selectedId,
  onSelect,
  onRing,
  emptyHint,
}: DeviceListProps) {
  if (vms.length === 0) {
    return <div className="list__empty">{emptyHint}</div>
  }
  return (
    <div className="list">
      {vms.map((vm) => (
        <DeviceRow
          key={vm.device.id}
          vm={vm}
          now={now}
          selected={vm.device.id === selectedId}
          onSelect={onSelect}
          onRing={onRing}
        />
      ))}
    </div>
  )
}
`,"src/apps/devices/components/DeviceMap.tsx":`import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { DeviceType, Freshness, GeoFix } from '../types'
import type { DeviceVM } from '../lib/select'
import { loadMapView, saveMapView } from '../store/devices'

export interface MapHandle {
  flyTo: (lat: number, lng: number, zoom?: number) => void
  flyToSelf: () => void
}

interface DeviceMapProps {
  devices: DeviceVM[]
  selfFix: GeoFix | null
  selectedId: string | null
  onSelect: (id: string) => void
  /** Bottom padding (px) so pins clear the bottom sheet when flying to them. */
  bottomInset: number
}

const DEFAULT_VIEW: { center: [number, number]; zoom: number } = {
  center: [37.7749, -122.4194],
  zoom: 13,
}

/** Minimal filled glyphs for map pins (kept compact for small markers). */
function glyphPath(type: DeviceType): string {
  switch (type) {
    case 'phone':
      return '<rect x="7" y="3" width="10" height="18" rx="2.4"/>'
    case 'tablet':
      return '<rect x="5" y="4" width="14" height="16" rx="2.2"/>'
    case 'laptop':
      return '<rect x="5" y="6" width="14" height="8" rx="1.3"/><path d="M3 16h18l1.3 2.4a.6.6 0 0 1-.5.9H2.2a.6.6 0 0 1-.5-.9Z"/>'
    case 'headphones':
      return '<path d="M5 13a7 7 0 0 1 14 0" fill="none" stroke="currentColor" stroke-width="1.9"/><rect x="3.5" y="12.5" width="3.6" height="6.5" rx="1.8"/><rect x="16.9" y="12.5" width="3.6" height="6.5" rx="1.8"/>'
    case 'watch':
      return '<rect x="7.5" y="7.5" width="9" height="9" rx="2.4"/><rect x="9.5" y="3" width="5" height="4" rx="1"/><rect x="9.5" y="17" width="5" height="4" rx="1"/>'
    case 'tracker':
      return '<circle cx="12" cy="12" r="8"/>'
    default:
      return '<circle cx="12" cy="12" r="6.5"/>'
  }
}

function freshClass(f: Freshness): string {
  return \`pin--\${f}\`
}

function pinIcon(vm: DeviceVM, selected: boolean): L.DivIcon {
  const cls = ['pin', freshClass(vm.freshness)]
  if (selected) cls.push('pin--selected')
  if (vm.device.status === 'lost') cls.push('pin--lost')
  const html = \`
    <div class="pin__disc">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">\${glyphPath(
        vm.device.type,
      )}</svg>
    </div>
    <div class="pin__tail"></div>\`
  return L.divIcon({
    className: cls.join(' '),
    html,
    iconSize: [40, 48],
    iconAnchor: [20, 46],
  })
}

function selfIcon(): L.DivIcon {
  return L.divIcon({
    className: 'self-pin',
    html: '<div class="self-pin__ring"></div><div class="self-pin__dot"></div>',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  })
}

export const DeviceMap = forwardRef<MapHandle, DeviceMapProps>(function DeviceMap(
  { devices, selfFix, selectedId, onSelect, bottomInset },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<Map<string, L.Marker>>(new Map())
  const selfMarkerRef = useRef<L.Marker | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect
  const insetRef = useRef(bottomInset)
  insetRef.current = bottomInset

  // Init the map exactly once.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    const saved = loadMapView() ?? DEFAULT_VIEW
    const map = L.map(containerRef.current, {
      center: saved.center,
      zoom: saved.zoom,
      zoomControl: false,
      attributionControl: true,
      preferCanvas: false,
    })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(map)

    map.on('moveend', () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        const c = map.getCenter()
        saveMapView({ center: [c.lat, c.lng], zoom: map.getZoom() })
      }, 400)
    })

    mapRef.current = map
    const markers = markersRef.current

    // Keep the map sized correctly as the rail/sheet posture changes.
    const ro = new ResizeObserver(() => map.invalidateSize())
    ro.observe(containerRef.current)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      ro.disconnect()
      map.remove()
      mapRef.current = null
      markers.clear()
      selfMarkerRef.current = null
    }
  }, [])

  // Reconcile device markers whenever the decorated list or selection changes.
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const live = markersRef.current
    const seen = new Set<string>()

    for (const vm of devices) {
      if (vm.device.isSelf || !vm.device.lastFix) continue
      seen.add(vm.device.id)
      const { lat, lng } = vm.device.lastFix
      const selected = vm.device.id === selectedId
      const existing = live.get(vm.device.id)
      if (existing) {
        existing.setLatLng([lat, lng])
        existing.setIcon(pinIcon(vm, selected))
      } else {
        const m = L.marker([lat, lng], {
          icon: pinIcon(vm, selected),
          keyboard: true,
          title: vm.device.name,
        })
        m.on('click', () => onSelectRef.current(vm.device.id))
        m.addTo(map)
        live.set(vm.device.id, m)
      }
    }

    // Drop markers for devices that disappeared.
    for (const [id, marker] of live) {
      if (!seen.has(id)) {
        marker.remove()
        live.delete(id)
      }
    }
  }, [devices, selectedId])

  // Self pin tracks live position.
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    if (!selfFix) {
      selfMarkerRef.current?.remove()
      selfMarkerRef.current = null
      return
    }
    if (!selfMarkerRef.current) {
      selfMarkerRef.current = L.marker([selfFix.lat, selfFix.lng], {
        icon: selfIcon(),
        interactive: false,
        zIndexOffset: -1000,
      }).addTo(map)
    } else {
      selfMarkerRef.current.setLatLng([selfFix.lat, selfFix.lng])
    }
  }, [selfFix])

  useImperativeHandle(ref, () => ({
    flyTo(lat, lng, zoom) {
      const map = mapRef.current
      if (!map) return
      const targetZoom = zoom ?? Math.max(map.getZoom(), 16)
      // Shift the centre down so the pin clears the bottom sheet and sits in
      // the middle of the *visible* area above it.
      const center = map.unproject(
        map.project([lat, lng], targetZoom).add(L.point(0, insetRef.current / 2)),
        targetZoom,
      )
      map.flyTo(center, targetZoom, { duration: 0.45 })
    },
    flyToSelf() {
      const map = mapRef.current
      if (!map || !selfFix) return
      const targetZoom = Math.max(map.getZoom(), 15)
      const center = map.unproject(
        map
          .project([selfFix.lat, selfFix.lng], targetZoom)
          .add(L.point(0, insetRef.current / 2)),
        targetZoom,
      )
      map.flyTo(center, targetZoom, { duration: 0.45 })
    },
  }))

  return <div ref={containerRef} className="map" role="application" aria-label="Map of your devices" />
})
`,"src/apps/devices/components/DeviceRow.tsx":`import { memo } from 'react'
import type { DeviceVM } from '../lib/select'
import { formatAge, formatDistance, freshnessColorVar } from '../lib/geo'
import { ChevronIcon, DeviceGlyph, SoundIcon } from './Icons'

interface DeviceRowProps {
  vm: DeviceVM
  now: number
  selected: boolean
  onSelect: (id: string) => void
  onRing: (id: string) => void
}

function batteryClass(b: number): string {
  if (b <= 20) return 'battery battery--low'
  return 'battery'
}

export const DeviceRow = memo(function DeviceRow({
  vm,
  now,
  selected,
  onSelect,
  onRing,
}: DeviceRowProps) {
  const { device, freshness, distanceM } = vm
  const fix = device.lastFix

  const distance = device.isSelf
    ? 'This device'
    : distanceM != null
      ? formatDistance(distanceM)
      : 'No location yet'

  const metaParts: string[] = []
  if (fix?.place) metaParts.push(fix.place)
  if (fix) metaParts.push(formatAge(fix.ts, now))

  return (
    <div
      className={\`row\${selected ? ' row--selected' : ''}\`}
      role="button"
      tabIndex={0}
      aria-label={\`\${device.name}, \${distance}\`}
      onClick={() => onSelect(device.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(device.id)
        }
      }}
    >
      <div className="row__tile" style={{ color: freshnessColorVar(freshness) }}>
        <DeviceGlyph type={device.type} size={26} />
        {device.battery != null && (
          <span className={batteryClass(device.battery)}>{device.battery}</span>
        )}
      </div>

      <div className="row__body">
        <div className="row__line1">
          <span className="row__name">{device.name}</span>
          {device.status === 'lost' && <span className="pill pill--lost">Lost</span>}
        </div>
        <div className="row__line2">
          <span
            className="dot"
            style={{ background: freshnessColorVar(freshness) }}
            aria-hidden="true"
          />
          <span className="row__distance tnum">{distance}</span>
          {metaParts.length > 0 && (
            <span className="row__meta tnum"> · {metaParts.join(' · ')}</span>
          )}
        </div>
      </div>

      <button
        className="row__ring"
        aria-label={\`Play sound on \${device.name}\`}
        onClick={(e) => {
          e.stopPropagation()
          onRing(device.id)
        }}
      >
        <SoundIcon size={20} />
      </button>
      <ChevronIcon size={20} className="row__chevron" />
    </div>
  )
})
`,"src/apps/devices/components/Icons.tsx":`import type { DeviceType } from '../types'

interface IconProps {
  size?: number
  className?: string
}

/* ---- Chrome: stroke icons (1.75px, rounded caps) ---- */

const strokeProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

function Svg({
  size = 24,
  className,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  )
}

export const SearchIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="6.5" {...strokeProps} />
    <line x1="20" y1="20" x2="16" y2="16" {...strokeProps} />
  </Svg>
)

export const LocateIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="4" {...strokeProps} />
    <line x1="12" y1="2" x2="12" y2="5" {...strokeProps} />
    <line x1="12" y1="19" x2="12" y2="22" {...strokeProps} />
    <line x1="2" y1="12" x2="5" y2="12" {...strokeProps} />
    <line x1="19" y1="12" x2="22" y2="12" {...strokeProps} />
  </Svg>
)

export const DirectionsIcon = (p: IconProps) => (
  <Svg {...p}>
    <polygon points="3,11 21,3 13,21 11,13" {...strokeProps} />
  </Svg>
)

export const SoundIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 9.5 L8 9.5 L13 5 L13 19 L8 14.5 L4 14.5 Z" {...strokeProps} />
    <path d="M16.5 8.5 a4 4 0 0 1 0 7" {...strokeProps} />
    <path d="M19 6 a7 7 0 0 1 0 12" {...strokeProps} />
  </Svg>
)

export const ChevronIcon = (p: IconProps) => (
  <Svg {...p}>
    <polyline points="9,6 15,12 9,18" {...strokeProps} />
  </Svg>
)

export const PlusIcon = (p: IconProps) => (
  <Svg {...p}>
    <line x1="12" y1="5" x2="12" y2="19" {...strokeProps} />
    <line x1="5" y1="12" x2="19" y2="12" {...strokeProps} />
  </Svg>
)

export const CloseIcon = (p: IconProps) => (
  <Svg {...p}>
    <line x1="6" y1="6" x2="18" y2="18" {...strokeProps} />
    <line x1="18" y1="6" x2="6" y2="18" {...strokeProps} />
  </Svg>
)

export const ForgetIcon = (p: IconProps) => (
  <Svg {...p}>
    <polyline points="4,7 20,7" {...strokeProps} />
    <path d="M9 7 V5 a1 1 0 0 1 1-1 h4 a1 1 0 0 1 1 1 V7" {...strokeProps} />
    <path d="M6 7 l1 12 a1 1 0 0 0 1 1 h8 a1 1 0 0 0 1-1 l1-12" {...strokeProps} />
  </Svg>
)

export const LostIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3 L21 19 H3 Z" {...strokeProps} />
    <line x1="12" y1="10" x2="12" y2="14" {...strokeProps} />
    <circle cx="12" cy="16.5" r="0.6" fill="currentColor" stroke="none" />
  </Svg>
)

/* ---- Device glyphs: filled monochrome ---- */

function GlyphSvg({
  size = 24,
  className,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  )
}

const PhoneGlyph = (p: IconProps) => (
  <GlyphSvg {...p}>
    <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
    <rect x="9.5" y="18.4" width="5" height="1.4" rx="0.7" fill="var(--surface)" />
  </GlyphSvg>
)

const TabletGlyph = (p: IconProps) => (
  <GlyphSvg {...p}>
    <rect x="4" y="3" width="16" height="18" rx="2.4" />
    <circle cx="12" cy="18.3" r="0.9" fill="var(--surface)" />
  </GlyphSvg>
)

const LaptopGlyph = (p: IconProps) => (
  <GlyphSvg {...p}>
    <rect x="5" y="5" width="14" height="9" rx="1.4" />
    <path d="M3 16 h18 l1.5 2.6 a0.7 0.7 0 0 1-0.6 1 H2.1 a0.7 0.7 0 0 1-0.6-1 Z" />
  </GlyphSvg>
)

const HeadphonesGlyph = (p: IconProps) => (
  <GlyphSvg {...p}>
    <path d="M4 13 a8 8 0 0 1 16 0" fill="none" stroke="currentColor" strokeWidth="1.9" />
    <rect x="3" y="12.5" width="4" height="7" rx="2" />
    <rect x="17" y="12.5" width="4" height="7" rx="2" />
  </GlyphSvg>
)

const WatchGlyph = (p: IconProps) => (
  <GlyphSvg {...p}>
    <rect x="7" y="7" width="10" height="10" rx="2.6" />
    <rect x="9" y="2.5" width="6" height="4" rx="1.2" />
    <rect x="9" y="17.5" width="6" height="4" rx="1.2" />
  </GlyphSvg>
)

const TrackerGlyph = (p: IconProps) => (
  <GlyphSvg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="3" fill="var(--surface)" />
  </GlyphSvg>
)

const OtherGlyph = (p: IconProps) => (
  <GlyphSvg {...p}>
    <circle cx="12" cy="12" r="3.2" />
    <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="1.7" />
  </GlyphSvg>
)

const GLYPHS: Record<DeviceType, (p: IconProps) => React.ReactElement> = {
  phone: PhoneGlyph,
  tablet: TabletGlyph,
  laptop: LaptopGlyph,
  headphones: HeadphonesGlyph,
  watch: WatchGlyph,
  tracker: TrackerGlyph,
  other: OtherGlyph,
}

export function DeviceGlyph({
  type,
  size,
  className,
}: { type: DeviceType } & IconProps) {
  const G = GLYPHS[type] ?? OtherGlyph
  return <G size={size} className={className} />
}
`,"src/apps/devices/components/LocateFab.tsx":`import { LocateIcon } from './Icons'

interface LocateFabProps {
  onClick: () => void
  disabled?: boolean
  /** Lifts the FAB above the bottom sheet on phones. */
  bottomOffset: number
}

export function LocateFab({ onClick, disabled, bottomOffset }: LocateFabProps) {
  return (
    <button
      className="locate-fab"
      style={{ bottom: bottomOffset }}
      aria-label="Centre map on me"
      disabled={disabled}
      onClick={onClick}
    >
      <LocateIcon size={24} />
    </button>
  )
}
`,"src/apps/devices/components/Modal.tsx":`import { useEffect, useRef, useState, type ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  /** 'sheet' rises from the bottom (phone); 'card' centres (tablet). */
  variant: 'sheet' | 'card'
  labelledBy?: string
  children: ReactNode
}

/**
 * A lightweight modal layer used for the per-device action sheet and the
 * add-device flow. On phones it is a bottom sheet with drag-down-to-dismiss;
 * on tablets it is a centred card.
 */
export function Modal({ open, onClose, variant, labelledBy, children }: ModalProps) {
  const [dragY, setDragY] = useState(0)
  const startY = useRef<number | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Focus management: move focus into the dialog on open, restore it on close.
  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    const panel = panelRef.current
    const first = panel?.querySelector<HTMLElement>(
      'input, button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
    )
    ;(first ?? panel)?.focus()
    return () => previouslyFocused?.focus?.()
  }, [open])

  // Reset any residual drag offset whenever we open.
  useEffect(() => {
    if (open) setDragY(0)
  }, [open])

  if (!open) return null

  const isSheet = variant === 'sheet'

  // Keep Tab focus cycling within the dialog.
  const onTrapKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab') return
    const panel = panelRef.current
    if (!panel) return
    const focusable = panel.querySelectorAll<HTMLElement>(
      'input, button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
    )
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const active = document.activeElement
    if (e.shiftKey && active === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && active === last) {
      e.preventDefault()
      first.focus()
    }
  }

  const onPointerDown = (e: React.PointerEvent) => {
    if (!isSheet) return
    startY.current = e.clientY
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (startY.current == null) return
    setDragY(Math.max(0, e.clientY - startY.current))
  }
  const onPointerUp = () => {
    if (startY.current == null) return
    if (dragY > 110) onClose()
    else setDragY(0)
    startY.current = null
  }

  return (
    <div
      className={\`modal modal--\${variant}\`}
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={panelRef}
        className={\`modal__panel modal__panel--\${variant}\`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        style={isSheet ? { transform: \`translateY(\${dragY}px)\` } : undefined}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onTrapKeyDown}
      >
        {isSheet && (
          <div
            className="modal__grab"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <span className="grabber" />
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
`,"src/apps/devices/components/SearchPill.tsx":`import { useRef } from 'react'
import { CloseIcon, SearchIcon } from './Icons'

interface SearchPillProps {
  value: string
  onChange: (v: string) => void
  /** Tablet rail uses the always-expanded block form. */
  block?: boolean
}

export function SearchPill({ value, onChange, block }: SearchPillProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const filled = value.trim().length > 0
  return (
    <div className={\`searchpill\${block ? ' searchpill--block' : ''}\${filled ? ' searchpill--filled' : ''}\`}>
      <button
        className="searchpill__icon"
        aria-hidden="true"
        tabIndex={-1}
        onClick={() => inputRef.current?.focus()}
      >
        <SearchIcon size={20} />
      </button>
      <input
        ref={inputRef}
        className="searchpill__input"
        value={value}
        placeholder="Search"
        aria-label="Search devices"
        autoComplete="off"
        onChange={(e) => onChange(e.target.value)}
      />
      {filled && (
        <button
          className="searchpill__clear"
          aria-label="Clear search"
          onClick={() => {
            onChange('')
            inputRef.current?.focus()
          }}
        >
          <CloseIcon size={16} />
        </button>
      )}
    </div>
  )
}
`,"src/apps/devices/components/SideRail.tsx":`import type { ReactNode } from 'react'

/** Tablet master pane: a fixed-width rail beside the persistent map. */
export function SideRail({ children }: { children: ReactNode }) {
  return (
    <aside className="rail" aria-label="Your devices">
      {children}
    </aside>
  )
}
`,"src/apps/devices/components/Toast.tsx":`import { useEffect } from 'react'

interface ToastProps {
  message: string | null
  onDone: () => void
}

export function Toast({ message, onDone }: ToastProps) {
  useEffect(() => {
    if (!message) return
    const id = setTimeout(onDone, 2200)
    return () => clearTimeout(id)
  }, [message, onDone])

  if (!message) return null
  return (
    <div className="toast" role="status" aria-live="polite">
      {message}
    </div>
  )
}
`,"src/apps/devices/devices.css":`/*
 * Devices — app-owned styling.
 * Scoped base rules live on .devices-app so they cannot leak to other Apps
 * (the Lifecycle app is a code editor and needs text selection).
 */
.devices-app {
  color: var(--text);
  background: var(--ground);
  letter-spacing: -0.01em;
  overscroll-behavior: none;
  -webkit-user-select: none;
  user-select: none;
}
.devices-app :focus-visible {
  outline: 2px solid var(--beacon);
  outline-offset: 2px;
  border-radius: 6px;
}
.tnum {
  font-variant-numeric: tabular-nums;
}

/* ---------- App shell ---------- */
.devices-app {
  position: fixed;
  inset: 0;
  overflow: hidden;
  background:
    radial-gradient(120% 80% at 50% -10%, rgba(255, 176, 46, 0.06), transparent 60%),
    var(--ground);
}
.base {
  position: absolute;
  inset: 0;
}
.base[inert] {
  /* Background is non-interactive while a modal is open. */
  pointer-events: none;
}
.map {
  position: absolute;
  inset: 0;
  z-index: 0;
}
.devices-app--tablet .map {
  left: var(--rail-w);
}

/* ---------- Leaflet theming ---------- */
/* Two-class selector beats Leaflet's own \`.leaflet-container { background:#ddd }\`
   regardless of stylesheet import order. */
.map.leaflet-container {
  background: var(--map-bg);
  font-family: inherit;
}
/* Darken only the tiles, leaving pins and chrome untouched. */
.leaflet-tile-pane {
  filter: invert(1) hue-rotate(180deg) brightness(0.96) contrast(0.9)
    saturate(0.55);
}
.leaflet-control-attribution {
  background: rgba(11, 15, 20, 0.6) !important;
  color: var(--text-faint) !important;
  font-size: 10px;
  padding: 2px 6px;
  backdrop-filter: blur(6px);
}
.leaflet-control-attribution a {
  color: var(--text-dim) !important;
}

/* ---------- Map pins ---------- */
.pin {
  color: var(--text-faint);
}
.pin--live {
  color: var(--mint);
}
.pin--stale {
  color: var(--stale);
}
.pin--cold,
.pin--lost {
  color: var(--cold);
}
.pin__disc {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--surface-raised);
  border: 2.5px solid currentColor;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-float);
  transition: transform var(--dur-press) var(--ease-spring);
}
.pin__disc svg {
  color: var(--text);
}
.pin__tail {
  width: 0;
  height: 0;
  margin: -4px auto 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-top: 9px solid currentColor;
  filter: drop-shadow(0 3px 2px rgba(0, 0, 0, 0.35));
}
.pin--selected .pin__disc {
  border-color: var(--beacon);
  box-shadow:
    0 0 0 4px rgba(255, 176, 46, 0.22),
    var(--shadow-float);
  transform: scale(1.12);
}
.pin--selected {
  color: var(--beacon);
  z-index: 1000 !important;
}

/* ---------- Self pin ---------- */
.self-pin__dot {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--mint);
  border: 2.5px solid #06120d;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px rgba(61, 225, 176, 0.7);
}
.self-pin__ring {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid var(--mint);
  transform: translate(-50%, -50%);
  animation: ping 2.6s ease-out infinite;
}
@keyframes ping {
  0% {
    opacity: 0.65;
    transform: translate(-50%, -50%) scale(1);
  }
  80%,
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(3.4);
  }
}

/* ---------- Floating controls ---------- */
.float-top {
  position: absolute;
  z-index: 420;
  top: calc(var(--safe-t) + 12px);
  left: calc(var(--safe-l) + 12px);
  right: calc(var(--safe-r) + 12px);
  display: flex;
}
.locate-fab {
  position: absolute;
  z-index: 420;
  right: calc(var(--safe-r) + 16px);
  width: var(--tt-primary);
  height: var(--tt-primary);
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: var(--text);
  background: rgba(22, 28, 34, 0.82);
  border: 1px solid var(--hairline);
  box-shadow: var(--shadow-float);
  backdrop-filter: blur(14px) saturate(1.2);
  transition: transform var(--dur-press), background var(--dur-press);
}
.locate-fab:active {
  transform: scale(0.92);
}
.locate-fab:disabled {
  opacity: 0.4;
}
.devices-app--tablet .locate-fab {
  bottom: calc(var(--safe-b) + 20px);
}

/* ---------- Search pill ---------- */
.searchpill {
  display: flex;
  align-items: center;
  height: var(--tt-secondary);
  width: var(--tt-secondary);
  max-width: var(--tt-secondary);
  border-radius: var(--r-pill);
  background: rgba(22, 28, 34, 0.82);
  border: 1px solid var(--hairline);
  box-shadow: var(--shadow-card);
  backdrop-filter: blur(14px) saturate(1.2);
  overflow: hidden;
  transition: max-width var(--dur-sheet) var(--ease-spring);
}
.searchpill:focus-within,
.searchpill--filled,
.searchpill--block {
  max-width: 320px;
  width: 100%;
}
.searchpill--block {
  max-width: none;
  flex: 1;
}
.searchpill__icon {
  flex: 0 0 var(--tt-secondary);
  height: var(--tt-secondary);
  display: grid;
  place-items: center;
  color: var(--text-dim);
}
.searchpill__input {
  flex: 1;
  min-width: 0;
  border: none;
  background: none;
  outline: none;
  padding-right: 8px;
  font-size: var(--t-body);
}
.searchpill__input::placeholder {
  color: var(--text-faint);
}
.searchpill__clear {
  flex: 0 0 var(--tt-secondary);
  height: var(--tt-secondary);
  display: grid;
  place-items: center;
  color: var(--text-dim);
}

/* ---------- Bottom sheet (phone) ---------- */
.sheet {
  position: absolute;
  z-index: 440;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  background: rgba(22, 28, 34, 0.92);
  border-top-left-radius: var(--r-sheet);
  border-top-right-radius: var(--r-sheet);
  border-top: 1px solid var(--hairline);
  box-shadow: var(--shadow-sheet);
  backdrop-filter: blur(20px) saturate(1.3);
  transition: transform var(--dur-sheet) var(--ease-spring);
  will-change: transform;
}
.sheet__handle {
  padding: 8px 16px 10px;
  touch-action: none;
}
.grabber {
  display: block;
  width: 40px;
  height: 5px;
  margin: 2px auto 10px;
  border-radius: var(--r-pill);
  background: var(--hairline);
}
.sheet__scroll {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 0 12px calc(var(--safe-b) + 16px);
}

/* ---------- Sheet/rail header ---------- */
.header {
  display: flex;
  align-items: center;
  gap: 14px;
}
.header__label,
.list__label {
  font-size: var(--t-micro);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-dim);
  font-weight: 600;
}
.header__count,
.list__count {
  color: var(--text-faint);
}
.addbtn {
  flex: 0 0 var(--tt-secondary);
  width: var(--tt-secondary);
  height: var(--tt-secondary);
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: var(--on-beacon);
  background: var(--beacon);
  box-shadow: 0 4px 16px rgba(255, 176, 46, 0.35);
  transition: transform var(--dur-press), background var(--dur-press);
}
.addbtn:active {
  transform: scale(0.92);
  background: var(--beacon-press);
}

/* ---------- Device rows ---------- */
.list {
  display: flex;
  flex-direction: column;
}
.list__empty {
  padding: 28px 16px;
  color: var(--text-faint);
  font-size: var(--t-body);
  text-align: center;
}
.row {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 72px;
  padding: 0 6px;
  border-radius: var(--r-row);
  transition: background var(--dur-press);
}
.row:active {
  background: var(--surface-raised);
}
.row--selected {
  background: var(--surface-raised);
}
.row__tile {
  position: relative;
  flex: 0 0 46px;
  width: 46px;
  height: 46px;
  border-radius: 13px;
  display: grid;
  place-items: center;
  background: #11171d;
  border: 1px solid var(--hairline);
}
.row__tile svg {
  color: var(--text);
}
.battery {
  position: absolute;
  right: -5px;
  bottom: -5px;
  min-width: 20px;
  height: 18px;
  padding: 0 4px;
  border-radius: var(--r-pill);
  background: var(--surface-raised);
  border: 1px solid var(--hairline);
  color: var(--text-dim);
  font-size: 10px;
  font-weight: 600;
  display: grid;
  place-items: center;
  font-variant-numeric: tabular-nums;
}
.battery--low {
  color: var(--battery-low);
  border-color: rgba(255, 138, 91, 0.5);
}
.row__body {
  flex: 1;
  min-width: 0;
}
.row__line1 {
  display: flex;
  align-items: center;
  gap: 8px;
}
.row__name {
  font-size: var(--t-name);
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.row__line2 {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 3px;
  font-size: var(--t-sub);
  color: var(--text-dim);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.row__distance {
  color: var(--text);
  font-weight: 500;
}
.row__meta {
  color: var(--text-dim);
  overflow: hidden;
  text-overflow: ellipsis;
}
.dot {
  flex: 0 0 auto;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.row__ring {
  position: relative;
  flex: 0 0 var(--tt-inrow);
  width: var(--tt-inrow);
  height: var(--tt-inrow);
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: var(--text-dim);
  background: #11171d;
  border: 1px solid var(--hairline);
  transition: transform var(--dur-press), color var(--dur-press);
}
/* Expand the touch area to 44px without growing the visual disc. */
.row__ring::after {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 50%;
}
.row__ring:active {
  transform: scale(0.9);
  color: var(--beacon);
}
.row__chevron {
  color: var(--text-faint);
  flex: 0 0 auto;
}
.pill {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 2px 7px;
  border-radius: var(--r-pill);
}
.pill--lost {
  color: var(--cold);
  background: rgba(255, 91, 110, 0.14);
}

/* ---------- Modal (action / add) ---------- */
.modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: var(--scrim);
  backdrop-filter: blur(2px);
  animation: fade var(--dur-press) ease-out;
}
.modal--sheet {
  display: flex;
  align-items: flex-end;
}
.modal--card {
  display: grid;
  place-items: center;
  padding: 24px;
}
.modal__panel {
  background: rgba(22, 28, 34, 0.96);
  border: 1px solid var(--hairline);
  box-shadow: var(--shadow-sheet);
  backdrop-filter: blur(24px) saturate(1.3);
}
.modal__panel--sheet {
  width: 100%;
  border-top-left-radius: var(--r-sheet);
  border-top-right-radius: var(--r-sheet);
  padding: 0 18px calc(var(--safe-b) + 18px);
  animation: rise var(--dur-sheet) var(--ease-spring);
}
.modal__panel--card {
  width: min(420px, 100%);
  border-radius: var(--r-sheet);
  padding: 22px;
  animation: pop var(--dur-sheet) var(--ease-spring);
}
.modal__grab {
  padding: 10px 0 4px;
  touch-action: none;
}
@keyframes fade {
  from {
    opacity: 0;
  }
}
@keyframes rise {
  from {
    transform: translateY(100%);
  }
}
@keyframes pop {
  from {
    transform: scale(0.94);
    opacity: 0;
  }
}

/* ---------- Action sheet ---------- */
.action {
  padding-top: 4px;
}
.action__head {
  display: flex;
  align-items: center;
  gap: 14px;
  padding-bottom: 18px;
}
.action__tile {
  flex: 0 0 52px;
  width: 52px;
  height: 52px;
  border-radius: 15px;
  display: grid;
  place-items: center;
  background: #11171d;
  border: 1px solid var(--hairline);
}
.action__tile svg {
  color: var(--text);
}
.action__name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 22px;
  font-weight: 650;
  letter-spacing: -0.02em;
}
.action__meta {
  margin-top: 3px;
  font-size: var(--t-sub);
  color: var(--text-dim);
}
.action__row {
  display: flex;
  gap: 10px;
}
.act {
  flex: 1;
  min-height: var(--tt-primary);
  padding: 10px 4px;
  border-radius: var(--r-row);
  background: var(--surface-raised);
  border: 1px solid var(--hairline);
  color: var(--text);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 500;
  transition: transform var(--dur-press), background var(--dur-press);
}
.act:active {
  transform: scale(0.96);
  background: #252f38;
}
.act:disabled {
  opacity: 0.4;
}
.act--active {
  color: var(--cold);
  border-color: rgba(255, 91, 110, 0.45);
  background: rgba(255, 91, 110, 0.1);
}
.action__forget {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  width: 100%;
  margin-top: 14px;
  padding: 10px;
  color: var(--text-dim);
  font-size: var(--t-sub);
}
.action__forget:active {
  color: var(--cold);
}
.action__note {
  margin-top: 10px;
  font-size: 12px;
  color: var(--text-faint);
  text-align: center;
  line-height: 1.4;
}

/* ---------- Add sheet ---------- */
.add {
  padding-top: 4px;
}
.add__title {
  font-size: 21px;
  font-weight: 650;
  letter-spacing: -0.02em;
  margin-bottom: 16px;
}
.add__field {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: var(--r-row);
  background: #11171d;
  border: 1px solid var(--hairline);
}
.add__glyph {
  flex: 0 0 40px;
  width: 40px;
  height: 40px;
  border-radius: 11px;
  display: grid;
  place-items: center;
  background: var(--surface-raised);
}
.add__input {
  flex: 1;
  min-width: 0;
  border: none;
  background: none;
  outline: none;
  font-size: 18px;
  font-weight: 550;
  padding: 8px 0;
}
.add__input::placeholder {
  color: var(--text-faint);
}
.add__types {
  display: flex;
  gap: 8px;
  margin: 14px 0;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: none;
}
.add__types::-webkit-scrollbar {
  display: none;
}
.typechip {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: var(--r-pill);
  background: var(--surface-raised);
  border: 1px solid var(--hairline);
  color: var(--text-dim);
  font-size: var(--t-sub);
  white-space: nowrap;
  transition: all var(--dur-press);
}
.typechip--on {
  color: var(--on-beacon);
  background: var(--beacon);
  border-color: var(--beacon);
  font-weight: 600;
}
.typechip--on svg {
  color: var(--on-beacon);
}
.add__loc {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-size: var(--t-sub);
  color: var(--text-dim);
}
.add__cta {
  width: 100%;
  height: var(--tt-primary);
  border-radius: var(--r-row);
  background: var(--beacon);
  color: var(--on-beacon);
  font-size: 17px;
  font-weight: 650;
  box-shadow: 0 6px 20px rgba(255, 176, 46, 0.32);
  transition: transform var(--dur-press), background var(--dur-press);
}
.add__cta:active {
  transform: scale(0.98);
  background: var(--beacon-press);
}

/* ---------- Tablet rail ---------- */
.rail {
  position: absolute;
  z-index: 440;
  top: 0;
  left: 0;
  bottom: 0;
  width: var(--rail-w);
  display: flex;
  flex-direction: column;
  background: rgba(16, 20, 24, 0.96);
  border-right: 1px solid var(--hairline);
  box-shadow: 8px 0 32px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(20px);
  padding-left: var(--safe-l);
}
.rail__head {
  padding: calc(var(--safe-t) + 16px) 18px 14px;
  border-bottom: 1px solid var(--hairline);
}
.brand {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 14px;
}
.brand__dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: var(--beacon);
  box-shadow: 0 0 10px rgba(255, 176, 46, 0.7);
}
.rail__controls {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}
.rail__scroll {
  flex: 1;
  overflow-y: auto;
  padding: 8px 12px;
}
.rail__detail {
  border-top: 1px solid var(--hairline);
  padding: 8px 18px calc(var(--safe-b) + 18px);
  background: rgba(22, 28, 34, 0.6);
}
.rail__close {
  display: block;
  margin-left: auto;
  padding: 6px 4px;
  color: var(--beacon);
  font-size: var(--t-sub);
  font-weight: 600;
}

/* ---------- Toast ---------- */
.toast {
  position: fixed;
  z-index: 1200;
  left: 50%;
  bottom: calc(var(--safe-b) + 28px);
  transform: translateX(-50%);
  max-width: calc(100vw - 32px);
  padding: 12px 18px;
  border-radius: var(--r-pill);
  background: rgba(30, 38, 46, 0.97);
  border: 1px solid var(--hairline);
  color: var(--text);
  font-size: var(--t-sub);
  font-weight: 500;
  box-shadow: var(--shadow-float);
  backdrop-filter: blur(16px);
  animation: rise-toast var(--dur-sheet) var(--ease-spring);
  text-align: center;
}
@keyframes rise-toast {
  from {
    opacity: 0;
    transform: translate(-50%, 12px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .self-pin__ring {
    animation: none;
    opacity: 0;
  }
}
`,"src/apps/devices/hooks/useMediaQuery.ts":`import { useEffect, useState } from 'react'

/** Reactive matchMedia hook so JS knows the current layout posture. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/** True on tablet-and-up, where the side-rail master/detail layout is used. */
export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 880px)')
}
`,"src/apps/devices/hooks/useSelfTracking.ts":`import { useEffect, useState } from 'react'
import type { DeviceType } from '../types'
import {
  getCurrentFix,
  queryPermission,
  readBattery,
  watchFix,
  type PermissionState,
} from '../lib/geolocation'
import {
  ensureSelfDevice,
  seedExamples,
  updateFix,
  updateSelfBattery,
} from '../store/devices'

/** Best-effort friendly name + type for the device the app runs on. */
function describeThisDevice(): { name: string; type: DeviceType } {
  const ua = navigator.userAgent || ''
  if (/iPhone/i.test(ua)) return { name: 'This iPhone', type: 'phone' }
  if (/iPad/i.test(ua)) return { name: 'This iPad', type: 'tablet' }
  if (/Android/i.test(ua)) {
    return /Mobile/i.test(ua)
      ? { name: 'This phone', type: 'phone' }
      : { name: 'This tablet', type: 'tablet' }
  }
  if (/Macintosh/i.test(ua)) return { name: 'This Mac', type: 'laptop' }
  if (/Windows/i.test(ua)) return { name: 'This PC', type: 'laptop' }
  return { name: 'This device', type: 'laptop' }
}

export interface SelfTracking {
  permission: PermissionState
  hasFix: boolean
}

/**
 * Creates the self device on first launch, watches its live position,
 * seeds example devices once a base location is known, and tracks battery.
 */
export function useSelfTracking(): SelfTracking {
  const [permission, setPermission] = useState<PermissionState>('unknown')
  const [hasFix, setHasFix] = useState(false)

  useEffect(() => {
    const desc = describeThisDevice()
    const selfId = ensureSelfDevice(desc.name, desc.type)
    let cancelled = false

    void queryPermission().then((p) => !cancelled && setPermission(p))
    void readBattery().then((b) => !cancelled && b != null && updateSelfBattery(b))

    const onFix = (fix: Parameters<typeof updateFix>[1]) => {
      if (cancelled) return
      updateFix(selfId, fix)
      seedExamples(fix)
      setHasFix(true)
      setPermission('granted')
    }

    // One-shot read so we centre/seed quickly, plus a live watch.
    void getCurrentFix()
      .then(onFix)
      .catch(() => {
        /* the watch below surfaces permission errors */
      })

    const stop = watchFix(onFix, (err) => {
      if (cancelled) return
      if (err.code === err.PERMISSION_DENIED) setPermission('denied')
    })

    return () => {
      cancelled = true
      stop()
    }
  }, [])

  return { permission, hasFix }
}
`,"src/apps/devices/hooks/useStore.ts":`import { useEffect, useState, useSyncExternalStore } from 'react'
import { getSnapshot, subscribe } from '../store/devices'

/** Subscribe to the persisted device store. */
export function useStore() {
  return useSyncExternalStore(subscribe, getSnapshot)
}

/**
 * A coarse clock that re-renders on an interval so relative times
 * ("2m ago") and freshness colours stay current without per-component timers.
 */
export function useNow(intervalMs = 30_000): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}
`,"src/apps/devices/index.tsx":`/*
 * Devices — App entry point.
 *
 * The Shell imports this module lazily and renders its default export. Styles
 * are imported here so they arrive with the App's chunk and never load for
 * another App.
 */
import './palette.css'
import './devices.css'
import App from './App'

export default App
`,"src/apps/devices/lib/geo.ts":`import type { DeviceType, Freshness, GeoFix } from '../types'

const EARTH_RADIUS_M = 6_371_000
const TEN_MIN = 10 * 60 * 1000
const ONE_DAY = 24 * 60 * 60 * 1000

const toRad = (deg: number) => (deg * Math.PI) / 180

/** Great-circle distance between two fixes, in metres. */
export function haversineMetres(a: GeoFix, b: GeoFix): number {
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)))
}

/** Human distance label with stable, tabular-friendly precision. */
export function formatDistance(metres: number): string {
  if (metres < 10) return 'here'
  if (metres < 1000) return \`\${Math.round(metres)} m\`
  if (metres < 10_000) return \`\${(metres / 1000).toFixed(1)} km\`
  return \`\${Math.round(metres / 1000)} km\`
}

/** Relative "last seen" label. */
export function formatAge(ts: number, now: number): string {
  const ms = Math.max(0, now - ts)
  if (ms < 45 * 1000) return 'just now'
  const mins = Math.round(ms / 60000)
  if (mins < 60) return \`\${mins}m ago\`
  const hours = Math.round(mins / 60)
  if (hours < 24) return \`\${hours}h ago\`
  const days = Math.round(hours / 24)
  if (days === 1) return 'yesterday'
  if (days < 7) return \`\${days}d ago\`
  const weeks = Math.round(days / 7)
  return \`\${weeks}w ago\`
}

/** Bucket a fix's age into a freshness band that drives colour. */
export function freshnessOf(fix: GeoFix | null, now: number): Freshness {
  if (!fix) return 'unknown'
  const age = now - fix.ts
  if (age < TEN_MIN) return 'live'
  if (age < ONE_DAY) return 'stale'
  return 'cold'
}

export function freshnessColorVar(f: Freshness): string {
  switch (f) {
    case 'live':
      return 'var(--mint)'
    case 'stale':
      return 'var(--stale)'
    case 'cold':
      return 'var(--cold)'
    default:
      return 'var(--text-faint)'
  }
}

/** Guess a device type from a free-text name so registration needs no picker. */
export function guessType(name: string): DeviceType {
  const n = name.toLowerCase()
  const has = (...words: string[]) => words.some((w) => n.includes(w))
  if (has('pod', 'bud', 'headphone', 'earphone', 'beats', 'sony wh', 'speaker'))
    return 'headphones'
  if (has('watch', 'band')) return 'watch'
  if (has('ipad', 'tab', 'tablet', 'kindle', 'slate')) return 'tablet'
  if (has('mac', 'book', 'laptop', 'pc', 'desktop', 'thinkpad', 'surface', 'xps'))
    return 'laptop'
  if (has('tag', 'tile', 'tracker', 'key', 'wallet', 'finder', 'chip'))
    return 'tracker'
  if (has('phone', 'iphone', 'pixel', 'galaxy', 'oneplus', 'android', 'mobile'))
    return 'phone'
  return 'other'
}

/** A small deterministic offset (metres → degrees) for de-overlapping pins. */
export function offsetFix(base: GeoFix, dxMetres: number, dyMetres: number): GeoFix {
  const dLat = (dyMetres / EARTH_RADIUS_M) * (180 / Math.PI)
  const dLng =
    (dxMetres / (EARTH_RADIUS_M * Math.cos(toRad(base.lat)))) * (180 / Math.PI)
  return { ...base, lat: base.lat + dLat, lng: base.lng + dLng }
}
`,"src/apps/devices/lib/geolocation.ts":`import type { GeoFix } from '../types'

export type PermissionState = 'unknown' | 'prompt' | 'granted' | 'denied'

const HIGH_ACCURACY: PositionOptions = {
  enableHighAccuracy: true,
  maximumAge: 15_000,
  timeout: 15_000,
}

function fixFromPosition(pos: GeolocationPosition): GeoFix {
  return {
    lat: pos.coords.latitude,
    lng: pos.coords.longitude,
    accuracy: pos.coords.accuracy ?? undefined,
    ts: pos.timestamp,
  }
}

export function geolocationSupported(): boolean {
  return typeof navigator !== 'undefined' && 'geolocation' in navigator
}

/** One-shot position read, used when registering a new device. */
export function getCurrentFix(): Promise<GeoFix> {
  return new Promise((resolve, reject) => {
    if (!geolocationSupported()) {
      reject(new Error('Geolocation unavailable'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(fixFromPosition(pos)),
      (err) => reject(err),
      HIGH_ACCURACY,
    )
  })
}

/** Continuous position watch for the self device. Returns an unsubscribe fn. */
export function watchFix(
  onFix: (fix: GeoFix) => void,
  onError?: (err: GeolocationPositionError) => void,
): () => void {
  if (!geolocationSupported()) {
    onError?.({
      code: 2,
      message: 'Geolocation unavailable',
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3,
    } as GeolocationPositionError)
    return () => {}
  }
  const id = navigator.geolocation.watchPosition(
    (pos) => onFix(fixFromPosition(pos)),
    (err) => onError?.(err),
    HIGH_ACCURACY,
  )
  return () => navigator.geolocation.clearWatch(id)
}

/** Best-effort permission probe (not all browsers expose the Permissions API). */
export async function queryPermission(): Promise<PermissionState> {
  try {
    if (typeof navigator === 'undefined' || !navigator.permissions) return 'unknown'
    const status = await navigator.permissions.query({
      name: 'geolocation' as PermissionName,
    })
    return status.state as PermissionState
  } catch {
    return 'unknown'
  }
}

/** Best-effort battery read for the self device (Chromium-only API). */
export async function readBattery(): Promise<number | null> {
  try {
    const nav = navigator as Navigator & {
      getBattery?: () => Promise<{ level: number }>
    }
    if (!nav.getBattery) return null
    const b = await nav.getBattery()
    return Math.round(b.level * 100)
  } catch {
    return null
  }
}
`,"src/apps/devices/lib/select.ts":`import type { Device, Freshness, PersistedState } from '../types'
import { freshnessOf, haversineMetres } from './geo'

export interface DeviceVM {
  device: Device
  freshness: Freshness
  /** Distance from the self device in metres, or null if not computable. */
  distanceM: number | null
}

/**
 * Decorate every device with its freshness and distance-from-self, then sort:
 * self first, then nearest-first, with fix-less devices last.
 */
export function decorate(
  state: PersistedState,
  now: number,
  query = '',
): DeviceVM[] {
  const self = state.devices.find((d) => d.id === state.selfId) ?? null
  const selfFix = self?.lastFix ?? null
  const q = query.trim().toLowerCase()

  const vms = state.devices
    .filter((d) => (q ? d.name.toLowerCase().includes(q) : true))
    .map<DeviceVM>((device) => ({
      device,
      freshness: freshnessOf(device.lastFix, now),
      distanceM:
        selfFix && device.lastFix && !device.isSelf
          ? haversineMetres(selfFix, device.lastFix)
          : device.isSelf
            ? 0
            : null,
    }))

  return vms.sort((a, b) => {
    if (a.device.isSelf) return -1
    if (b.device.isSelf) return 1
    const ax = a.distanceM ?? Number.POSITIVE_INFINITY
    const bx = b.distanceM ?? Number.POSITIVE_INFINITY
    if (ax !== bx) return ax - bx
    return a.device.name.localeCompare(b.device.name)
  })
}
`,"src/apps/devices/lib/sound.ts":`/**
 * Plays a bright "find me" chime on THIS device using the Web Audio API.
 * Honest by design: there is no backend, so we can only ring the device the
 * app is open on. The UI labels remote rings accordingly.
 */
let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  try {
    if (!ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext
      if (!Ctor) return null
      ctx = new Ctor()
    }
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

/** Three rising pings, looped twice — recognisably a "find my device" sound. */
export function playFindChime(): void {
  const ac = getCtx()
  if (!ac) return
  const now = ac.currentTime
  const notes = [880, 1108.73, 1318.51] // A5, C#6, E6
  const master = ac.createGain()
  master.gain.value = 0.0001
  master.connect(ac.destination)

  let t = now
  for (let rep = 0; rep < 2; rep++) {
    notes.forEach((freq, i) => {
      const start = t + i * 0.16
      const osc = ac.createOscillator()
      const gain = ac.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, start)
      gain.gain.setValueAtTime(0.0001, start)
      gain.gain.exponentialRampToValueAtTime(0.5, start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.35)
      osc.connect(gain).connect(master)
      osc.start(start)
      osc.stop(start + 0.4)
    })
    t += 0.7
  }
  master.gain.setValueAtTime(0.6, now)
}

/** Try to vibrate as well, where supported (mobile). */
export function buzz(): void {
  try {
    navigator.vibrate?.([120, 80, 120, 80, 220])
  } catch {
    /* no-op */
  }
}
`,"src/apps/devices/palette.css":`/*
 * Devices — app-owned palette, type scale, radii and motion.
 * Scoped to .devices-app so these names cannot collide with another App's.
 */
.devices-app {
  /* Ground & stepped glass surfaces */
  --ground: #0e1216;
  --map-bg: #0b0f14;
  --surface: #161c22;
  --surface-raised: #1e262e;
  --hairline: #28323b;
  --scrim: rgba(8, 11, 15, 0.55);

  /* Text */
  --text: #eaf0f4;
  --text-dim: #8a98a6;
  --text-faint: #5c6873;

  /* Single brand accent — sodium amber. Spent sparingly. */
  --beacon: #ffb02e;
  --beacon-press: #e89a17;
  --on-beacon: #1a1206;

  /* Semantic colours — held out of decoration */
  --mint: #3de1b0; /* you / live */
  --online: #3fd08a;
  --battery-low: #ff8a5b;
  --stale: #f4b740;
  --cold: #ff5b6e; /* cold / lost */

  /* Type scale (px) */
  --t-hero: 28px;
  --t-name: 17px;
  --t-body: 15px;
  --t-sub: 13px;
  --t-micro: 11px;

  /* Spacing — 4px base */
  --s1: 4px;
  --s2: 8px;
  --s3: 12px;
  --s4: 16px;
  --s5: 20px;
  --s6: 24px;
  --s8: 32px;

  /* Radii */
  --r-row: 13px;
  --r-sheet: 18px;
  --r-pill: 999px;

  /* Touch targets */
  --tt-primary: 56px;
  --tt-secondary: 44px;
  --tt-inrow: 38px;

  /* Elevation */
  --shadow-sheet: 0 -12px 40px rgba(0, 0, 0, 0.45);
  --shadow-float: 0 8px 24px rgba(0, 0, 0, 0.4);
  --shadow-card: 0 2px 10px rgba(0, 0, 0, 0.3);

  /* Motion */
  --ease-spring: cubic-bezier(0.22, 1, 0.36, 1);
  --dur-sheet: 280ms;
  --dur-press: 120ms;
  --dur-fly: 450ms;

  /* Layout */
  --rail-w: 380px;
}

@media (prefers-reduced-motion: reduce) {
  .devices-app {
    --dur-sheet: 0ms;
    --dur-press: 0ms;
    --dur-fly: 0ms;
  }
}
`,"src/apps/devices/store/devices.ts":`import type { Device, DeviceType, GeoFix, PersistedState } from '../types'
import { offsetFix } from '../lib/geo'

const KEY = 'find.v1'
const MAP_KEY = 'find.map.v1'

type Listener = () => void

const EMPTY: PersistedState = {
  version: 1,
  devices: [],
  selfId: null,
  seeded: false,
}

function uid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return \`d_\${Date.now().toString(36)}_\${Math.random().toString(36).slice(2, 8)}\`
}

function load(): PersistedState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return EMPTY
    const parsed = JSON.parse(raw) as Partial<PersistedState>
    if (parsed.version !== 1 || !Array.isArray(parsed.devices)) return EMPTY
    return {
      version: 1,
      devices: parsed.devices as Device[],
      selfId: parsed.selfId ?? null,
      seeded: Boolean(parsed.seeded),
    }
  } catch {
    return EMPTY
  }
}

let state: PersistedState = load()
const listeners = new Set<Listener>()

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* storage may be full or unavailable; keep running in-memory */
  }
}

function commit(next: PersistedState) {
  state = next
  persist()
  listeners.forEach((l) => l())
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getSnapshot(): PersistedState {
  return state
}

// ---- Actions -------------------------------------------------------------

const now = () => Date.now()

/** Ensure a self device exists, creating one on first launch. Returns its id. */
export function ensureSelfDevice(name: string, type: DeviceType): string {
  if (state.selfId && state.devices.some((d) => d.id === state.selfId)) {
    return state.selfId
  }
  const id = uid()
  const t = now()
  const self: Device = {
    id,
    name,
    type,
    isSelf: true,
    lastFix: null,
    battery: null,
    status: 'online',
    createdAt: t,
    updatedAt: t,
  }
  commit({ ...state, devices: [self, ...state.devices], selfId: id })
  return id
}

export function addDevice(input: {
  name: string
  type: DeviceType
  fix: GeoFix | null
  battery?: number | null
}): string {
  const id = uid()
  const t = now()
  const device: Device = {
    id,
    name: input.name.trim() || 'New device',
    type: input.type,
    isSelf: false,
    lastFix: input.fix,
    battery: input.battery ?? null,
    status: 'online',
    createdAt: t,
    updatedAt: t,
  }
  commit({ ...state, devices: [...state.devices, device] })
  return id
}

function patch(id: string, patcher: (d: Device) => Device) {
  let changed = false
  const devices = state.devices.map((d) => {
    if (d.id !== id) return d
    changed = true
    return { ...patcher(d), updatedAt: now() }
  })
  if (changed) commit({ ...state, devices })
}

export function updateFix(id: string, fix: GeoFix) {
  patch(id, (d) => ({ ...d, lastFix: fix }))
}

export function updateSelfBattery(battery: number | null) {
  if (!state.selfId) return
  patch(state.selfId, (d) => ({ ...d, battery }))
}

export function renameDevice(id: string, name: string) {
  patch(id, (d) => ({ ...d, name: name.trim() || d.name }))
}

export function setType(id: string, type: DeviceType) {
  patch(id, (d) => ({ ...d, type }))
}

export function setLost(id: string, lost: boolean) {
  patch(id, (d) => ({ ...d, status: lost ? 'lost' : 'online' }))
}

export function removeDevice(id: string) {
  if (id === state.selfId) return // never forget the device you're on
  commit({ ...state, devices: state.devices.filter((d) => d.id !== id) })
}

/**
 * Seed a few realistic example devices around the given base fix, once.
 * They are obviously editable/forgettable so the user can replace them.
 */
export function seedExamples(base: GeoFix) {
  if (state.seeded) return
  const t = now()
  const minutes = (m: number) => t - m * 60_000
  const examples: Array<{
    name: string
    type: DeviceType
    dx: number
    dy: number
    ts: number
    battery: number
    place: string
    status: Device['status']
  }> = [
    { name: 'AirPods Pro', type: 'headphones', dx: 18, dy: -12, ts: minutes(3), battery: 64, place: 'Here', status: 'online' },
    { name: 'iPad', type: 'tablet', dx: -260, dy: 140, ts: minutes(95), battery: 38, place: 'Home', status: 'idle' },
    { name: 'Work Laptop', type: 'laptop', dx: 2400, dy: -1800, ts: minutes(60 * 26), battery: 12, place: 'Office', status: 'online' },
  ]
  const seeded: Device[] = examples.map((e) => {
    const fix = offsetFix(base, e.dx, e.dy)
    return {
      id: uid(),
      name: e.name,
      type: e.type,
      isSelf: false,
      lastFix: { ...fix, ts: e.ts, place: e.place, accuracy: 25 },
      battery: e.battery,
      status: e.status,
      createdAt: t,
      updatedAt: e.ts,
    }
  })
  commit({ ...state, devices: [...state.devices, ...seeded], seeded: true })
}

// ---- Map view (persisted separately to avoid re-render churn) -------------

export interface MapView {
  center: [number, number]
  zoom: number
}

export function loadMapView(): MapView | null {
  try {
    const raw = localStorage.getItem(MAP_KEY)
    if (!raw) return null
    const v = JSON.parse(raw) as MapView
    if (
      Array.isArray(v.center) &&
      v.center.length === 2 &&
      typeof v.zoom === 'number'
    ) {
      return v
    }
    return null
  } catch {
    return null
  }
}

export function saveMapView(view: MapView) {
  try {
    localStorage.setItem(MAP_KEY, JSON.stringify(view))
  } catch {
    /* ignore */
  }
}
`,"src/apps/devices/types.ts":`export type DeviceType =
  | 'phone'
  | 'tablet'
  | 'laptop'
  | 'headphones'
  | 'watch'
  | 'tracker'
  | 'other'

export type DeviceStatus = 'online' | 'idle' | 'lost'

/** A single positional reading for a device. */
export interface GeoFix {
  lat: number
  lng: number
  /** Reported accuracy radius in metres, if known. */
  accuracy?: number
  /** Epoch milliseconds at which the fix was taken. */
  ts: number
  /** Optional friendly place label (e.g. "Home"). */
  place?: string
}

export interface Device {
  id: string
  name: string
  type: DeviceType
  /** True for the single device the app is running on. */
  isSelf: boolean
  /** Last known position, or null if we have never had a fix. */
  lastFix: GeoFix | null
  /** Battery percentage 0–100, or null if unknown. */
  battery: number | null
  status: DeviceStatus
  createdAt: number
  updatedAt: number
}

/** The shape persisted to localStorage. */
export interface PersistedState {
  version: 1
  devices: Device[]
  /** Id of the self device, if one has been created. */
  selfId: string | null
  /** Whether the one-time example devices have been seeded. */
  seeded: boolean
}

/** Freshness buckets derived from how old a device's last fix is. */
export type Freshness = 'live' | 'stale' | 'cold' | 'unknown'
`,"src/apps/ide/IdeApp.tsx":`import { useCallback, useRef, useState, useSyncExternalStore } from 'react'
import type { EditorView } from '@codemirror/view'
import { Editor } from './components/Editor'
import { FileTree } from './components/FileTree'
import { KeyBar } from './components/KeyBar'
import { useKeyboardInset } from './hooks/useKeyboardInset'
import {
  exportPatch,
  getSnapshot,
  isDirty,
  paths,
  read,
  revert,
  revertAll,
  snapshotTakenAt,
  subscribe,
  write,
} from './workspace'

/*
 * A small IDE for reading and editing this project on a phone.
 *
 * Edits are local-only and live in localStorage: there is no backend and no
 * token, so work leaves the device as a patch you copy or download. Editing the
 * source here does not change the running app — the files are a snapshot taken
 * when the site was built.
 */

const OPEN_KEY = 'find.ide.open.v1'

function initialPath(): string {
  try {
    const saved = localStorage.getItem(OPEN_KEY)
    if (saved && paths.includes(saved)) return saved
  } catch {
    // Storage blocked; fall through to the default.
  }
  return paths.includes('README.md') ? 'README.md' : (paths[0] ?? '')
}

export default function IdeApp() {
  const edits = useSyncExternalStore(subscribe, getSnapshot)
  const [path, setPath] = useState(initialPath)
  const [drawer, setDrawer] = useState(false)
  const [menu, setMenu] = useState(false)
  const [note, setNote] = useState<string | null>(null)
  const [view, setView] = useState<EditorView | null>(null)

  const root = useRef<HTMLDivElement>(null)
  useKeyboardInset(root)

  const dirtyCount = Object.keys(edits).length
  const fileDirty = path in edits

  const pick = useCallback((next: string) => {
    setPath(next)
    setDrawer(false)
    try {
      localStorage.setItem(OPEN_KEY, next)
    } catch {
      // Not worth surfacing: the file is open either way.
    }
  }, [])

  const flash = (message: string) => {
    setNote(message)
    setMenu(false)
    window.setTimeout(() => setNote(null), 2400)
  }

  const copyPatch = async () => {
    const patch = exportPatch()
    if (!patch) return flash('Nothing edited yet.')
    try {
      await navigator.clipboard.writeText(patch)
      flash(\`Copied a patch for \${dirtyCount} file\${dirtyCount === 1 ? '' : 's'}.\`)
    } catch {
      flash('Clipboard blocked — use Download instead.')
    }
  }

  const downloadPatch = () => {
    const patch = exportPatch()
    if (!patch) return flash('Nothing edited yet.')
    const url = URL.createObjectURL(new Blob([patch], { type: 'text/x-patch' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'find.patch'
    a.click()
    URL.revokeObjectURL(url)
    flash('Patch downloaded.')
  }

  return (
    <div className="ide-app" ref={root}>
      <header className="ide-bar">
        <button
          type="button"
          className="ide-bar__btn"
          onClick={() => setDrawer((d) => !d)}
          aria-label="Files"
          aria-expanded={drawer}
          data-tip="Files"
        >
          ☰
        </button>

        <div className="ide-bar__file">
          <span className="ide-bar__path">{path || 'No file'}</span>
          {fileDirty && <span className="ide-bar__dot" aria-label="Edited" />}
        </div>

        <button
          type="button"
          className="ide-bar__btn"
          onClick={() => setMenu((m) => !m)}
          aria-label="Actions"
          aria-expanded={menu}
          data-tip="Actions"
          data-tip-align="end"
        >
          ⋯
        </button>

        {menu && (
          <>
            <div className="ide-scrim" onClick={() => setMenu(false)} />
            <div className="ide-menu" role="menu">
              <button
                type="button"
                role="menuitem"
                disabled={!fileDirty}
                onClick={() => { revert(path); flash('Reverted this file.') }}
              >
                Revert this file
              </button>
              <button type="button" role="menuitem" disabled={dirtyCount === 0} onClick={copyPatch}>
                Copy patch{dirtyCount > 0 && \` (\${dirtyCount})\`}
              </button>
              <button
                type="button"
                role="menuitem"
                disabled={dirtyCount === 0}
                onClick={downloadPatch}
              >
                Download patch
              </button>
              <button
                type="button"
                role="menuitem"
                className="ide-menu__danger"
                disabled={dirtyCount === 0}
                onClick={() => { revertAll(); flash('All edits reverted.') }}
              >
                Revert all edits
              </button>
              <p className="ide-menu__note">
                Edits stay on this device. Snapshot taken{' '}
                {new Date(snapshotTakenAt).toLocaleDateString()}.
              </p>
            </div>
          </>
        )}
      </header>

      <div className="ide-body">
        {drawer && <div className="ide-scrim ide-scrim--drawer" onClick={() => setDrawer(false)} />}
        <aside className={\`ide-side\${drawer ? ' ide-side--open' : ''}\`}>
          <FileTree paths={paths} current={path} dirty={isDirty} onPick={pick} />
        </aside>

        <main className="ide-main">
          {path ? (
            <Editor
              path={path}
              initialText={read(path)}
              onChange={(text) => write(path, text)}
              onReady={setView}
            />
          ) : (
            <p className="ide-empty">No files in the snapshot.</p>
          )}
        </main>
      </div>

      <KeyBar view={view} />

      {note && <div className="ide-toast" role="status">{note}</div>}
    </div>
  )
}
`,"src/apps/ide/components/Editor.tsx":`import { useEffect, useRef } from 'react'
import { EditorState, type Extension } from '@codemirror/state'
import { EditorView, highlightActiveLine, keymap, lineNumbers } from '@codemirror/view'
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands'
import {
  HighlightStyle,
  bracketMatching,
  indentOnInput,
  syntaxHighlighting,
} from '@codemirror/language'
import { highlightSelectionMatches, search, searchKeymap } from '@codemirror/search'
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete'
import { javascript } from '@codemirror/lang-javascript'
import { css } from '@codemirror/lang-css'
import { html } from '@codemirror/lang-html'
import { json } from '@codemirror/lang-json'
import { tags as t } from '@lezer/highlight'

/*
 * The editing surface.
 *
 * CodeMirror owns its own DOM and state, so this component is a thin imperative
 * shell: mount once per file, tear down on unmount. React never re-renders the
 * editor's contents.
 */

/** Matches the App's palette rather than CodeMirror's defaults. */
const highlight = HighlightStyle.define([
  { tag: [t.keyword, t.moduleKeyword], color: 'var(--ide-kw)' },
  { tag: [t.string, t.special(t.string)], color: 'var(--ide-str)' },
  { tag: [t.number, t.bool, t.null], color: 'var(--ide-num)' },
  { tag: [t.comment, t.lineComment, t.blockComment], color: 'var(--ide-cmt)', fontStyle: 'italic' },
  { tag: [t.typeName, t.className, t.namespace], color: 'var(--ide-type)' },
  { tag: [t.function(t.variableName), t.function(t.propertyName)], color: 'var(--ide-fn)' },
  { tag: [t.propertyName, t.attributeName], color: 'var(--ide-prop)' },
  { tag: [t.tagName, t.angleBracket], color: 'var(--ide-tag)' },
  { tag: [t.operator, t.punctuation, t.separator], color: 'var(--ide-punc)' },
  { tag: [t.definition(t.variableName), t.variableName], color: 'var(--ide-text)' },
])

/** Language support chosen by extension. Everything else is plain text. */
function languageFor(path: string): Extension[] {
  if (/\\.(ts|tsx|js|jsx|mjs|cjs)$/.test(path)) {
    return [javascript({ typescript: /\\.tsx?$/.test(path), jsx: /x$/.test(path) })]
  }
  if (path.endsWith('.css')) return [css()]
  if (path.endsWith('.html')) return [html()]
  if (path.endsWith('.json')) return [json()]
  return []
}

const theme = EditorView.theme(
  {
    '&': { height: '100%', fontSize: 'var(--ide-code-size)', color: 'var(--ide-text)' },
    '.cm-scroller': {
      fontFamily: 'var(--ide-mono)',
      lineHeight: '1.55',
      // Momentum scrolling, and room to scroll the last line clear of the bar.
      paddingBottom: '40vh',
    },
    '.cm-content': { caretColor: 'var(--ide-accent)' },
    '.cm-gutters': {
      background: 'var(--ide-panel)',
      color: 'var(--ide-faint)',
      border: 'none',
      // Narrow gutter: horizontal space is the scarcest resource on a phone.
      minWidth: '2.2em',
    },
    '.cm-activeLine': { background: 'var(--ide-active)' },
    '.cm-activeLineGutter': { background: 'var(--ide-active)', color: 'var(--ide-dim)' },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection': {
      background: 'var(--ide-selection)',
    },
    '.cm-cursor, .cm-dropCursor': { borderLeftColor: 'var(--ide-accent)', borderLeftWidth: '2px' },
    '.cm-selectionMatch': { background: 'var(--ide-match)' },
    '.cm-matchingBracket, &.cm-focused .cm-matchingBracket': {
      background: 'var(--ide-match)',
      outline: '1px solid var(--ide-hairline)',
    },
    '.cm-panels': { background: 'var(--ide-panel)', color: 'var(--ide-text)' },
    '.cm-panels input, .cm-panels button': {
      background: 'var(--ide-bg)',
      color: 'var(--ide-text)',
      border: '1px solid var(--ide-hairline)',
      borderRadius: '6px',
      padding: '4px 7px',
    },
    '.cm-searchMatch': { background: 'var(--ide-match)' },
    '.cm-searchMatch-selected': { background: 'var(--ide-accent)', color: '#06121b' },
  },
  { dark: true },
)

interface Props {
  path: string
  initialText: string
  onChange: (text: string) => void
  /** Set once on mount so the parent can drive the key bar. */
  onReady: (view: EditorView) => void
}

export function Editor({ path, initialText, onChange, onReady }: Props) {
  const host = useRef<HTMLDivElement>(null)
  // Kept in a ref so changing the handler never forces the editor to remount
  // and lose cursor position or undo history.
  const changeRef = useRef(onChange)
  changeRef.current = onChange
  const readyRef = useRef(onReady)
  readyRef.current = onReady

  useEffect(() => {
    if (!host.current) return
    const view = new EditorView({
      state: EditorState.create({
        doc: initialText,
        extensions: [
          lineNumbers(),
          history(),
          highlightActiveLine(),
          highlightSelectionMatches(),
          bracketMatching(),
          closeBrackets(),
          indentOnInput(),
          search({ top: true }),
          syntaxHighlighting(highlight),
          EditorView.lineWrapping,
          keymap.of([
            ...closeBracketsKeymap,
            ...defaultKeymap,
            ...historyKeymap,
            ...searchKeymap,
            indentWithTab,
          ]),
          languageFor(path),
          theme,
          EditorView.updateListener.of((u) => {
            if (u.docChanged) changeRef.current(u.state.doc.toString())
          }),
        ],
      }),
      parent: host.current,
    })
    readyRef.current(view)
    return () => view.destroy()
    // Remount only when the file changes: a new file is a new document, new
    // language and a fresh undo history.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path])

  return <div className="ide-editor" ref={host} />
}
`,"src/apps/ide/components/FileTree.tsx":`import { useMemo, useState } from 'react'

/*
 * The file picker.
 *
 * A flat list grouped by directory rather than a nested tree with disclosure
 * triangles: on a phone, tapping open four levels of nesting to reach
 * \`src/apps/devices/components/DeviceRow.tsx\` is slow and the triangles are
 * small targets. A filter box reaches any file in two or three keystrokes.
 */

interface Props {
  paths: string[]
  current: string
  dirty: (path: string) => boolean
  onPick: (path: string) => void
}

function dirOf(path: string): string {
  const i = path.lastIndexOf('/')
  return i === -1 ? '/' : path.slice(0, i)
}

function baseOf(path: string): string {
  return path.slice(path.lastIndexOf('/') + 1)
}

export function FileTree({ paths, current, dirty, onPick }: Props) {
  const [query, setQuery] = useState('')

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase()
    const matched = q ? paths.filter((p) => p.toLowerCase().includes(q)) : paths
    const byDir = new Map<string, string[]>()
    for (const p of matched) {
      const d = dirOf(p)
      const list = byDir.get(d)
      if (list) list.push(p)
      else byDir.set(d, [p])
    }
    return [...byDir.entries()]
  }, [paths, query])

  return (
    <div className="ide-tree">
      <div className="ide-tree__search">
        <input
          className="ide-tree__input"
          type="search"
          inputMode="search"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          placeholder="Filter files"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Filter files"
        />
      </div>

      <div className="ide-tree__scroll">
        {groups.length === 0 && <p className="ide-tree__empty">No files match “{query}”.</p>}
        {groups.map(([dir, items]) => (
          <section key={dir} className="ide-tree__group">
            <h3 className="ide-tree__dir">{dir}</h3>
            {items.map((path) => (
              <button
                key={path}
                type="button"
                className={\`ide-tree__file\${path === current ? ' ide-tree__file--on' : ''}\`}
                onClick={() => onPick(path)}
                aria-current={path === current || undefined}
              >
                <span className="ide-tree__name">{baseOf(path)}</span>
                {dirty(path) && <span className="ide-tree__dot" aria-label="Edited" />}
              </button>
            ))}
          </section>
        ))}
      </div>
    </div>
  )
}
`,"src/apps/ide/components/KeyBar.tsx":`import type { EditorView } from '@codemirror/view'
import { indentMore, redo, undo } from '@codemirror/commands'

/*
 * The symbol row.
 *
 * Phone keyboards bury braces, brackets and angle brackets two layers deep, and
 * there is no Cmd+Z. Writing TypeScript without this is miserable, so it sits
 * directly above the keyboard and inserts at the cursor.
 */

const KEYS = [
  '{', '}', '(', ')', '[', ']', '<', '>', '/', '=', ';', ':', '.', ',',
  "'", '"', '\`', '$', '_', '-', '+', '|', '&', '!', '?', '*', '#', '@',
]

interface Props {
  view: EditorView | null
}

export function KeyBar({ view }: Props) {
  const insert = (text: string) => {
    if (!view) return
    const { from, to } = view.state.selection.main
    view.dispatch({
      changes: { from, to, insert: text },
      selection: { anchor: from + text.length },
      scrollIntoView: true,
    })
    // Keep focus so the keyboard does not dismiss between taps.
    view.focus()
  }

  const run = (cmd: (v: EditorView) => boolean) => {
    if (!view) return
    cmd(view)
    view.focus()
  }

  return (
    <div className="ide-keybar" role="toolbar" aria-label="Code symbols">
      <button
        type="button"
        className="ide-keybar__key ide-keybar__key--wide"
        aria-label="Undo"
        // Pointer-down rather than click: a click would blur the editor first
        // and the phone keyboard would close on every tap.
        onPointerDown={(e) => { e.preventDefault(); run(undo) }}
      >
        ↶
      </button>
      <button
        type="button"
        className="ide-keybar__key ide-keybar__key--wide"
        aria-label="Redo"
        onPointerDown={(e) => { e.preventDefault(); run(redo) }}
      >
        ↷
      </button>
      <button
        type="button"
        className="ide-keybar__key ide-keybar__key--wide"
        aria-label="Indent"
        onPointerDown={(e) => { e.preventDefault(); run(indentMore) }}
      >
        ⇥
      </button>
      <span className="ide-keybar__sep" />
      {KEYS.map((k) => (
        <button
          key={k}
          type="button"
          className="ide-keybar__key"
          aria-label={\`Insert \${k}\`}
          onPointerDown={(e) => { e.preventDefault(); insert(k) }}
        >
          {k}
        </button>
      ))}
    </div>
  )
}
`,"src/apps/ide/hooks/useKeyboardInset.ts":`import { useEffect } from 'react'
import type { RefObject } from 'react'

/**
 * Keeps \`--ide-kb\` on the given element equal to the height the on-screen
 * keyboard is covering.
 *
 * This is the difference between a usable phone editor and a useless one. The
 * Shell hosts every App in a \`position: fixed\` container, and on iOS the layout
 * viewport does not shrink when the keyboard opens — \`window.innerHeight\` stays
 * the same — so a fixed-position editor keeps its full height and the bottom
 * third of it, including the caret, sits behind the keyboard. Only
 * \`visualViewport\` reports what is actually visible.
 *
 * Falls back to doing nothing where \`visualViewport\` is unavailable; the editor
 * then behaves as it would on a desktop, which is correct there anyway.
 */
export function useKeyboardInset(ref: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const vv = window.visualViewport
    const el = ref.current
    if (!vv || !el) return

    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        // What the layout thinks exists, minus what is actually visible.
        const hidden = window.innerHeight - vv.height - vv.offsetTop
        // Ignore sub-pixel noise and the small deltas from URL-bar collapse.
        el.style.setProperty('--ide-kb', hidden > 60 ? \`\${Math.round(hidden)}px\` : '0px')
      })
    }

    update()
    vv.addEventListener('resize', update)
    vv.addEventListener('scroll', update)
    return () => {
      cancelAnimationFrame(frame)
      vv.removeEventListener('resize', update)
      vv.removeEventListener('scroll', update)
      el.style.removeProperty('--ide-kb')
    }
  }, [ref])
}
`,"src/apps/ide/ide.css":`/*
 * IDE — app-owned styling.
 *
 * Every selector is prefixed \`ide-\`, and the palette is scoped to \`.ide-app\`
 * rather than \`:root\`, so nothing here can reach Devices or Lifecycle.
 */
.ide-app {
  --ide-bg: #0d1117;
  --ide-panel: #131a22;
  --ide-panel-hi: #1b242e;
  --ide-hairline: #232d38;
  --ide-text: #dfe7ef;
  --ide-dim: #8494a4;
  --ide-faint: #566472;
  --ide-accent: #8b7cf6;
  --ide-active: rgba(139, 124, 246, 0.08);
  --ide-selection: rgba(139, 124, 246, 0.28);
  --ide-match: rgba(139, 124, 246, 0.22);
  --ide-dirty: #f0b429;

  /* Syntax */
  --ide-kw: #c792ea;
  --ide-str: #9fd67a;
  --ide-num: #f2a765;
  --ide-cmt: #5f6d7c;
  --ide-type: #7fd1e0;
  --ide-fn: #82aaff;
  --ide-prop: #c3cede;
  --ide-tag: #ff8a9b;
  --ide-punc: #7f8c9b;

  --ide-mono: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas,
    'Liberation Mono', monospace;
  --ide-code-size: 13px;
  --ide-keybar-h: 44px;
  /* Set by useKeyboardInset to the height the on-screen keyboard covers. */
  --ide-kb: 0px;

  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: var(--ide-text);
  background: var(--ide-bg);
  /* Lift the whole app above the on-screen keyboard. */
  padding-bottom: var(--ide-kb);
}

.ide-app :focus-visible {
  outline: 2px solid var(--ide-accent);
  outline-offset: 1px;
}

/* ---------- Top bar ---------- */
.ide-bar {
  position: relative;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 4px;
  height: 42px;
  padding: 0 calc(var(--safe-r) + 4px) 0 calc(var(--safe-l) + 4px);
  background: var(--ide-panel);
  border-bottom: 1px solid var(--ide-hairline);
}
.ide-bar__btn {
  flex: 0 0 auto;
  width: 38px;
  height: 34px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  color: var(--ide-dim);
  font-size: 17px;
  line-height: 1;
}
.ide-bar__btn:active {
  background: var(--ide-panel-hi);
  color: var(--ide-text);
}
.ide-bar__file {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
}
.ide-bar__path {
  font-family: var(--ide-mono);
  font-size: 12px;
  color: var(--ide-text);
  white-space: nowrap;
  overflow: hidden;
  /* A long path is more legible truncated at the front: the filename matters
     more than the leading directories. */
  direction: rtl;
  text-overflow: ellipsis;
}
.ide-bar__dot,
.ide-tree__dot {
  flex: 0 0 auto;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--ide-dirty);
}

/* ---------- Tooltips ---------- */
/* Hover-only: a tooltip fired by touch just sticks to the screen after a tap.
   Every control here also carries an aria-label, so nothing is lost on a
   phone. */
@media (hover: hover) {
  .ide-app [data-tip] {
    position: relative;
  }
  .ide-app [data-tip]::after {
    content: attr(data-tip);
    position: absolute;
    z-index: 70;
    top: calc(100% + 7px);
    left: 50%;
    transform: translateX(-50%);
    padding: 5px 9px;
    border-radius: 7px;
    background: var(--ide-panel-hi);
    border: 1px solid var(--ide-hairline);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.45);
    color: var(--ide-text);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    font-size: 11.5px;
    font-weight: 500;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: opacity 110ms ease 380ms;
  }
  .ide-app [data-tip][data-tip-align='end']::after {
    left: auto;
    right: 0;
    transform: none;
  }
  .ide-app [data-tip]:hover::after,
  .ide-app [data-tip]:focus-visible::after {
    opacity: 1;
  }
}

/* ---------- Actions menu ---------- */
.ide-scrim {
  position: absolute;
  inset: 0;
  z-index: 40;
}
.ide-scrim--drawer {
  position: fixed;
  z-index: 20;
  background: rgba(4, 7, 10, 0.55);
}
.ide-menu {
  position: absolute;
  z-index: 50;
  top: calc(100% + 6px);
  right: calc(var(--safe-r) + 6px);
  width: min(268px, calc(100vw - 24px));
  padding: 6px;
  border-radius: 12px;
  background: var(--ide-panel-hi);
  border: 1px solid var(--ide-hairline);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
}
.ide-menu button {
  display: block;
  width: 100%;
  padding: 11px 12px;
  border-radius: 8px;
  text-align: left;
  font-size: 14px;
  color: var(--ide-text);
}
.ide-menu button:active {
  background: var(--ide-panel);
}
.ide-menu button:disabled {
  color: var(--ide-faint);
}
.ide-menu__danger:not(:disabled) {
  color: #ff8a9b;
}
.ide-menu__note {
  padding: 8px 12px 4px;
  font-size: 11px;
  line-height: 1.45;
  color: var(--ide-faint);
  border-top: 1px solid var(--ide-hairline);
  margin-top: 4px;
}

/* ---------- Body ---------- */
.ide-body {
  flex: 1;
  min-height: 0;
  display: flex;
  position: relative;
}

/* Phone: the file list is an overlay drawer. */
.ide-side {
  position: absolute;
  z-index: 30;
  top: 0;
  bottom: 0;
  left: 0;
  width: min(78%, 300px);
  display: flex;
  flex-direction: column;
  background: var(--ide-panel);
  border-right: 1px solid var(--ide-hairline);
  transform: translateX(-101%);
  transition: transform 200ms cubic-bezier(0.22, 1, 0.36, 1);
  padding-left: var(--safe-l);
}
.ide-side--open {
  transform: none;
  box-shadow: 8px 0 28px rgba(0, 0, 0, 0.45);
}

.ide-main {
  flex: 1;
  min-width: 0;
  position: relative;
}
.ide-editor {
  position: absolute;
  inset: 0;
}
.ide-empty {
  padding: 24px;
  color: var(--ide-faint);
  font-size: 14px;
}

/* ---------- File list ---------- */
.ide-tree {
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
}
.ide-tree__search {
  flex: 0 0 auto;
  padding: 8px;
  border-bottom: 1px solid var(--ide-hairline);
}
.ide-tree__input {
  width: 100%;
  height: 36px;
  padding: 0 10px;
  border-radius: 8px;
  background: var(--ide-bg);
  border: 1px solid var(--ide-hairline);
  outline: none;
  font-size: 14px;
  color: var(--ide-text);
}
.ide-tree__input::placeholder {
  color: var(--ide-faint);
}
.ide-tree__scroll {
  flex: 1;
  overflow-y: auto;
  padding-bottom: calc(var(--safe-b) + 12px);
}
.ide-tree__empty {
  padding: 20px 12px;
  color: var(--ide-faint);
  font-size: 13px;
}
.ide-tree__group {
  padding-top: 4px;
}
.ide-tree__dir {
  position: sticky;
  top: 0;
  z-index: 1;
  padding: 7px 12px 5px;
  font-family: var(--ide-mono);
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--ide-faint);
  background: var(--ide-panel);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ide-tree__file {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  /* 40px keeps this a comfortable touch target without wasting list space. */
  min-height: 40px;
  padding: 0 12px 0 20px;
  text-align: left;
  font-family: var(--ide-mono);
  font-size: 12.5px;
  color: var(--ide-dim);
}
.ide-tree__file--on {
  color: var(--ide-text);
  background: var(--ide-active);
  box-shadow: inset 2px 0 0 var(--ide-accent);
}
.ide-tree__file:active {
  background: var(--ide-panel-hi);
}
.ide-tree__name {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ---------- Symbol row ---------- */
.ide-keybar {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 4px;
  height: var(--ide-keybar-h);
  padding: 0 calc(var(--safe-r) + 6px) 0 calc(var(--safe-l) + 6px);
  background: var(--ide-panel);
  border-top: 1px solid var(--ide-hairline);
  overflow-x: auto;
  scrollbar-width: none;
  /* Horizontal scroll only; never let a drag here scroll the page. */
  overscroll-behavior-x: contain;
}
.ide-keybar::-webkit-scrollbar {
  display: none;
}
.ide-keybar__key {
  flex: 0 0 auto;
  min-width: 32px;
  height: 32px;
  padding: 0 6px;
  border-radius: 7px;
  display: grid;
  place-items: center;
  background: var(--ide-panel-hi);
  border: 1px solid var(--ide-hairline);
  color: var(--ide-text);
  font-family: var(--ide-mono);
  font-size: 14px;
  line-height: 1;
}
.ide-keybar__key--wide {
  min-width: 40px;
  color: var(--ide-accent);
  font-size: 15px;
}
.ide-keybar__key:active {
  background: var(--ide-accent);
  color: #0b0f16;
}
.ide-keybar__sep {
  flex: 0 0 auto;
  width: 1px;
  height: 20px;
  margin: 0 3px;
  background: var(--ide-hairline);
}

/* ---------- Toast ---------- */
.ide-toast {
  position: absolute;
  z-index: 60;
  left: 50%;
  bottom: calc(var(--ide-keybar-h) + var(--ide-kb) + 14px);
  transform: translateX(-50%);
  max-width: calc(100% - 28px);
  padding: 9px 15px;
  border-radius: 999px;
  background: var(--ide-panel-hi);
  border: 1px solid var(--ide-hairline);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ---------- Tablet: the drawer becomes a permanent rail ---------- */
@media (min-width: 880px) {
  .ide-side {
    position: relative;
    transform: none;
    box-shadow: none;
    width: 280px;
    flex: 0 0 280px;
  }
  .ide-scrim--drawer,
  .ide-bar__btn[aria-label='Files'] {
    display: none;
  }
  .ide-bar__file {
    justify-content: flex-start;
    padding-left: 8px;
  }
  .ide-bar__path {
    direction: ltr;
    font-size: 12.5px;
  }
  .ide-app {
    --ide-code-size: 13.5px;
  }
}
`,"src/apps/ide/index.tsx":`/*
 * IDE — App entry point.
 *
 * The Shell imports this module lazily and renders its default export, so
 * CodeMirror only downloads when you actually open the IDE.
 */
import './ide.css'
import IdeApp from './IdeApp'

export default IdeApp
`,"src/apps/ide/snapshot.plugin.ts":`import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import type { Plugin } from 'vite'

/*
 * Build-time snapshot of this repository's own source, exposed to the IDE app
 * as the virtual module \`virtual:project-snapshot\`.
 *
 * This is build-time config, so it cannot live purely inside the App at
 * runtime — it is wired up by one import in vite.config.ts. That is the
 * documented exception described in AGENTS.md. Keeping the plugin in the App's
 * folder means the exception costs one line elsewhere rather than a block of
 * app-specific logic in the shared config.
 */

const VIRTUAL_ID = 'virtual:project-snapshot'
const RESOLVED_ID = '\\0' + VIRTUAL_ID

/** Directories never worth showing in a phone IDE. */
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', '.github', 'docs', 'public'])

/** Only text we can meaningfully syntax-highlight and edit. */
const KEEP_EXT = /\\.(ts|tsx|js|jsx|css|html|json|md|yml|yaml)$/

/** Skip anything generated or too large to be useful on a phone. */
const SKIP_FILES = new Set(['package-lock.json'])
const MAX_BYTES = 200_000

function walk(dir: string, root: string, out: Record<string, string>): void {
  for (const name of readdirSync(dir).sort()) {
    if (name.startsWith('.') && name !== '.oxlintrc.json') continue
    const full = join(dir, name)
    const stat = statSync(full)
    if (stat.isDirectory()) {
      if (SKIP_DIRS.has(name)) continue
      walk(full, root, out)
    } else {
      if (SKIP_FILES.has(name) || !KEEP_EXT.test(name) || stat.size > MAX_BYTES) continue
      out[relative(root, full).split(sep).join('/')] = readFileSync(full, 'utf8')
    }
  }
}

export function projectSnapshot(root = process.cwd()): Plugin {
  return {
    name: 'project-snapshot',
    resolveId: (id) => (id === VIRTUAL_ID ? RESOLVED_ID : null),
    load(id) {
      if (id !== RESOLVED_ID) return null
      const files: Record<string, string> = {}
      walk(root, root, files)
      // Re-read on every dev-server request for this module, so editing a file
      // on disk shows up in the IDE without restarting Vite.
      return \`export const files = \${JSON.stringify(files)}
export const capturedAt = \${JSON.stringify(new Date().toISOString())}\`
    },
  }
}
`,"src/apps/ide/workspace.ts":`import { capturedAt, files as snapshot } from 'virtual:project-snapshot'

/*
 * The workspace: a read-only build-time snapshot of the repository, with a
 * layer of local edits on top.
 *
 * Edits live in localStorage and never leave the device. The Shell unmounts an
 * App when you leave it, so every change is persisted immediately rather than
 * on some "save" action — navigating to Home mid-edit must not lose work.
 */

const KEY = 'find.ide.edits.v1'

type Edits = Record<string, string>
type Listener = () => void

function load(): Edits {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
    // Drop edits for files that no longer exist in the snapshot, so a rename
    // upstream cannot strand an unreachable buffer forever.
    const out: Edits = {}
    for (const [path, text] of Object.entries(parsed as Edits)) {
      if (typeof text === 'string' && path in snapshot) out[path] = text
    }
    return out
  } catch {
    return {}
  }
}

let edits: Edits = load()
const listeners = new Set<Listener>()

function persist(): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(edits))
  } catch {
    // Quota exceeded or storage blocked — keep the in-memory edit rather than
    // throwing away what the user just typed.
  }
}

function emit(): void {
  for (const l of listeners) l()
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getSnapshot(): Edits {
  return edits
}

/** Every path in the repository snapshot, sorted. */
export const paths: string[] = Object.keys(snapshot).sort()

/** When the snapshot was taken — shown in the UI so staleness is visible. */
export const snapshotTakenAt = capturedAt

/** Current text for a path: the local edit if there is one, else the original. */
export function read(path: string): string {
  return edits[path] ?? snapshot[path] ?? ''
}

/** The original, unedited text. */
export function original(path: string): string {
  return snapshot[path] ?? ''
}

export function isDirty(path: string): boolean {
  return path in edits
}

export function dirtyPaths(): string[] {
  return Object.keys(edits).sort()
}

export function write(path: string, text: string): void {
  if (!(path in snapshot)) return
  if (text === snapshot[path]) {
    // Edited back to the original: stop tracking it rather than storing a
    // no-op diff.
    if (!(path in edits)) return
    delete edits[path]
  } else {
    if (edits[path] === text) return
    edits[path] = text
  }
  edits = { ...edits }
  persist()
  emit()
}

export function revert(path: string): void {
  if (!(path in edits)) return
  delete edits[path]
  edits = { ...edits }
  persist()
  emit()
}

export function revertAll(): void {
  if (Object.keys(edits).length === 0) return
  edits = {}
  persist()
  emit()
}

/**
 * A unified diff of every edited file, in \`git apply\` format.
 *
 * Edits are local-only by design — there is no backend and no token — so this
 * is how work leaves the phone: export the patch, apply it on a real machine.
 */
export function exportPatch(): string {
  const out: string[] = []
  for (const path of dirtyPaths()) {
    out.push(diffFile(path, original(path), read(path)))
  }
  return out.join('')
}

/**
 * Minimal unified diff. Emits one hunk covering the whole file rather than
 * computing minimal hunks — patches are applied by \`git apply\`, which does not
 * care, and a correct whole-file hunk beats a subtly wrong minimal one.
 */
function diffFile(path: string, before: string, after: string): string {
  const a = before.length ? before.split('\\n') : []
  const b = after.length ? after.split('\\n') : []
  const lines = [
    \`diff --git a/\${path} b/\${path}\`,
    \`--- a/\${path}\`,
    \`+++ b/\${path}\`,
    \`@@ -1,\${a.length} +1,\${b.length} @@\`,
    ...a.map((l) => \`-\${l}\`),
    ...b.map((l) => \`+\${l}\`),
  ]
  return lines.join('\\n') + '\\n'
}
`,"src/apps/lifecycle/LifecycleApp.tsx":`import { useCallback, useEffect, useRef, useState } from 'react'
import { SAMPLE_CODE } from './sample'
import { parseCode } from './parser'
import { trace } from './tracer'
import type { CodeParam, ParseResult, TraceResult } from './types'
import { CodeEditor } from './components/CodeEditor'
import { TargetPicker } from './components/TargetPicker'
import { ParamPanel } from './components/ParamPanel'
import { BranchList } from './components/BranchList'
import { EntityGraph } from './components/EntityGraph'
import { Timeline } from './components/Timeline'
import { LogPanel } from './components/LogPanel'
import './lifecycle.css'

const EMPTY_PARSE: ParseResult = { candidates: [], params: [], branches: [] }

function overridesFromParams(params: CodeParam[]): Record<string, string> {
  const out: Record<string, string> = {}
  for (const p of params) out[p.name] = p.original
  return out
}

export default function LifecycleApp() {
  const [source, setSource] = useState(SAMPLE_CODE)
  const [parseResult, setParseResult] = useState<ParseResult>(EMPTY_PARSE)
  const [target, setTarget] = useState<string | undefined>(undefined)
  const [overrides, setOverrides] = useState<Record<string, string>>({})
  const [traceResult, setTraceResult] = useState<TraceResult | undefined>(undefined)
  const [tracing, setTracing] = useState(false)
  const [hoveredStep, setHoveredStep] = useState<number | undefined>(undefined)
  const [errorDismissed, setErrorDismissed] = useState(false)

  const sourceRef = useRef(source)
  sourceRef.current = source
  const skipNextParseDebounce = useRef(true)

  const runTrace = useCallback((src: string, tgt: string | undefined, ov: Record<string, string>) => {
    if (!tgt) {
      setTraceResult(undefined)
      return
    }
    setTracing(true)
    setErrorDismissed(false)
    window.setTimeout(() => {
      setTraceResult(trace(src, { target: tgt, paramOverrides: ov }))
      setTracing(false)
    }, 0)
  }, [])

  useEffect(() => {
    const result = parseCode(SAMPLE_CODE)
    const firstTarget = result.candidates[0]?.name
    const initOverrides = overridesFromParams(result.params)
    setParseResult(result)
    setTarget(firstTarget)
    setOverrides(initOverrides)
    runTrace(SAMPLE_CODE, firstTarget, initOverrides)
  }, [runTrace])

  useEffect(() => {
    if (skipNextParseDebounce.current) {
      skipNextParseDebounce.current = false
      return
    }
    const handle = window.setTimeout(() => {
      const result = parseCode(source)
      setParseResult(result)
      setTarget((prev) => (prev && result.candidates.some((c) => c.name === prev) ? prev : result.candidates[0]?.name))
      setOverrides((prevOv) => {
        const next: Record<string, string> = {}
        for (const p of result.params) next[p.name] = prevOv[p.name] ?? p.original
        return next
      })
    }, 250)
    return () => window.clearTimeout(handle)
  }, [source])

  const handleTraceClick = useCallback(() => {
    runTrace(sourceRef.current, target, overrides)
  }, [runTrace, target, overrides])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        handleTraceClick()
      } else if (e.key === 'Escape') {
        setErrorDismissed(true)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleTraceClick])

  const handleSelectTarget = (name: string) => {
    setTarget(name)
    runTrace(sourceRef.current, name, overrides)
  }

  const handleParamChange = (name: string, literal: string) => {
    const next = { ...overrides, [name]: literal }
    setOverrides(next)
    runTrace(sourceRef.current, target, next)
  }

  const showTraceError = Boolean(traceResult?.error) && !errorDismissed

  return (
    <div className="lc-app">
      <header className="lc-header">
        <h1 className="lc-title">Object Lifecycle Visualizer</h1>
        <button className="lc-trace-btn" type="button" onClick={handleTraceClick} disabled={!target}>
          Trace lifecycle
        </button>
        <div className="lc-status">
          {tracing ? (
            <span className="lc-spinner" aria-label="Tracing">
              <span className="lc-dot" />
              <span className="lc-dot" />
              <span className="lc-dot" />
            </span>
          ) : traceResult && !traceResult.error ? (
            <span className="lc-status-ok">{traceResult.events.length} events</span>
          ) : null}
        </div>
      </header>

      <div className="lc-body">
        <div className="lc-left">
          <CodeEditor value={source} onChange={setSource} />
          {parseResult.error ? <div className="lc-parse-error">{parseResult.error}</div> : null}
          <TargetPicker candidates={parseResult.candidates} selected={target} onSelect={handleSelectTarget} />
          <ParamPanel params={parseResult.params} overrides={overrides} onChange={handleParamChange} />
        </div>

        <div className="lc-right">
          <section className="lc-graph-section">
            <EntityGraph
              entities={traceResult?.entities ?? []}
              events={traceResult?.events ?? []}
              hoveredStep={hoveredStep}
            />
          </section>

          {showTraceError ? <div className="lc-error-banner">{traceResult?.error}</div> : null}

          <section className="lc-timeline-section">
            <Timeline
              events={traceResult?.events ?? []}
              entities={traceResult?.entities ?? []}
              hoveredStep={hoveredStep}
              onHoverStep={setHoveredStep}
            />
          </section>

          <section className="lc-bottom-row">
            <BranchList branches={parseResult.branches} branchesTaken={traceResult?.branchesTaken ?? []} />
            <LogPanel logs={traceResult?.logs ?? []} />
          </section>
        </div>
      </div>
    </div>
  )
}
`,"src/apps/lifecycle/components/BranchList.tsx":`import type { Branch } from '../types'

interface BranchListProps {
  branches: Branch[]
  branchesTaken: string[]
}

export function BranchList({ branches, branchesTaken }: BranchListProps) {
  return (
    <div className="lc-panel lc-branch-list">
      <div className="lc-panel-title">Branches</div>
      {branches.length === 0 ? (
        <div className="lc-empty">No if-branches found</div>
      ) : (
        <ul className="lc-branch-items">
          {branches.map((b) => {
            const taken = branchesTaken.includes(b.id)
            return (
              <li key={b.id} className="lc-branch-item">
                <span className={\`lc-badge \${taken ? 'lc-badge-taken' : 'lc-badge-skipped'}\`}>
                  {taken ? 'taken' : 'skipped'}
                </span>
                <span className="lc-branch-line">L{b.line}</span>
                <code className="lc-branch-cond">{b.condition}</code>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
`,"src/apps/lifecycle/components/CodeEditor.tsx":`import { useMemo, useRef } from 'react'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
}

export function CodeEditor({ value, onChange }: CodeEditorProps) {
  const gutterRef = useRef<HTMLPreElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const lineNumbers = useMemo(() => {
    const count = value.split('\\n').length
    return Array.from({ length: count }, (_, i) => i + 1).join('\\n')
  }, [value])

  const syncScroll = () => {
    if (gutterRef.current && textareaRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }

  return (
    <div className="lc-editor">
      <pre className="lc-editor-gutter" ref={gutterRef}>
        {lineNumbers}
      </pre>
      <textarea
        ref={textareaRef}
        className="lc-editor-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={syncScroll}
        spellCheck={false}
        wrap="off"
        aria-label="JavaScript source"
      />
    </div>
  )
}
`,"src/apps/lifecycle/components/EntityGraph.tsx":`import { useMemo } from 'react'
import type { Entity, LifeEvent } from '../types'

interface EntityGraphProps {
  entities: Entity[]
  events: LifeEvent[]
  hoveredStep: number | undefined
}

const NODE_W = 132
const NODE_H = 42
const COL_GAP = 84
const ROW_GAP = 20
const PAD = 20

interface LaidOutNode {
  entity: Entity
  x: number
  y: number
}

interface Layout {
  nodes: LaidOutNode[]
  width: number
  height: number
}

function opNameFromDetail(detail: string): string {
  const m = detail.match(/^([A-Za-z_$][\\w$]*)\\(/)
  return m ? m[1] : detail
}

/** BFS-by-parent depth: root entities sit in column 0, derivations flow right. */
function layout(entities: Entity[]): Layout {
  const byId = new Map(entities.map((e) => [e.id, e]))
  const levelOf = new Map<string, number>()

  function depthOf(id: string, seen: Set<string>): number {
    const cached = levelOf.get(id)
    if (cached !== undefined) return cached
    const entity = byId.get(id)
    if (!entity?.parentId || seen.has(id)) {
      levelOf.set(id, 0)
      return 0
    }
    seen.add(id)
    const d = depthOf(entity.parentId, seen) + 1
    levelOf.set(id, d)
    return d
  }

  entities.forEach((e) => depthOf(e.id, new Set()))

  const maxLevel = entities.reduce((m, e) => Math.max(m, levelOf.get(e.id) ?? 0), 0)
  const columns: Entity[][] = Array.from({ length: maxLevel + 1 }, () => [])
  entities.forEach((e) => columns[levelOf.get(e.id) ?? 0].push(e))

  const nodes: LaidOutNode[] = []
  let maxRows = 1
  columns.forEach((col, level) => {
    maxRows = Math.max(maxRows, col.length)
    col.forEach((entity, row) => {
      nodes.push({
        entity,
        x: PAD + level * (NODE_W + COL_GAP),
        y: PAD + row * (NODE_H + ROW_GAP),
      })
    })
  })

  const width = PAD * 2 + (maxLevel + 1) * NODE_W + maxLevel * COL_GAP
  const height = PAD * 2 + maxRows * NODE_H + (maxRows - 1) * ROW_GAP
  return { nodes, width: Math.max(width, 320), height: Math.max(height, 140) }
}

export function EntityGraph({ entities, events, hoveredStep }: EntityGraphProps) {
  const { nodes, width, height } = useMemo(() => layout(entities), [entities])
  const posById = useMemo(() => new Map(nodes.map((n) => [n.entity.id, n])), [nodes])

  const hoveredEvent = hoveredStep === undefined ? undefined : events.find((e) => e.step === hoveredStep)
  const activeEntityId = hoveredEvent?.entityId
  const activeProducedId = hoveredEvent?.producedId

  const edges = useMemo(() => events.filter((e) => e.kind === 'derive' && e.producedId), [events])

  if (entities.length === 0) {
    return (
      <div className="lc-panel lc-graph">
        <div className="lc-panel-title">Entity graph</div>
        <div className="lc-empty">Run a trace to see entities</div>
      </div>
    )
  }

  return (
    <div className="lc-panel lc-graph">
      <div className="lc-panel-title">Entity graph</div>
      <div className="lc-graph-scroll">
        <svg className="lc-graph-svg" viewBox={\`0 0 \${width} \${height}\`} width={width} height={height}>
          {edges.map((e) => {
            const from = posById.get(e.entityId)
            const to = e.producedId ? posById.get(e.producedId) : undefined
            if (!from || !to) return null
            const x1 = from.x + NODE_W
            const y1 = from.y + NODE_H / 2
            const x2 = to.x
            const y2 = to.y + NODE_H / 2
            const midX = (x1 + x2) / 2
            const active = hoveredEvent?.id === e.id
            return (
              <g key={e.id} className={\`lc-edge\${active ? ' lc-edge-active' : ''}\`}>
                <path d={\`M \${x1} \${y1} C \${midX} \${y1}, \${midX} \${y2}, \${x2} \${y2}\`} />
                <text x={midX} y={(y1 + y2) / 2 - 6} textAnchor="middle">
                  {opNameFromDetail(e.detail)}
                </text>
              </g>
            )
          })}
          {nodes.map(({ entity, x, y }) => {
            const active = entity.id === activeEntityId || entity.id === activeProducedId
            const derived = Boolean(entity.parentId)
            return (
              <g
                key={entity.id}
                className={\`lc-node\${derived ? ' lc-node-derived' : ''}\${active ? ' lc-node-active' : ''}\`}
                transform={\`translate(\${x},\${y})\`}
              >
                <rect width={NODE_W} height={NODE_H} rx={8} />
                <text x={10} y={17} className="lc-node-name">
                  {entity.name}
                </text>
                <text x={10} y={32} className="lc-node-kind">
                  {entity.kind}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
`,"src/apps/lifecycle/components/LogPanel.tsx":`interface LogPanelProps {
  logs: string[]
}

export function LogPanel({ logs }: LogPanelProps) {
  return (
    <div className="lc-panel lc-log-panel">
      <div className="lc-panel-title">Console</div>
      {logs.length === 0 ? (
        <div className="lc-empty">No console output</div>
      ) : (
        <pre className="lc-log-body">{logs.join('\\n')}</pre>
      )}
    </div>
  )
}
`,"src/apps/lifecycle/components/ParamPanel.tsx":`import type { CodeParam } from '../types'

interface ParamPanelProps {
  params: CodeParam[]
  overrides: Record<string, string>
  onChange: (name: string, literal: string) => void
}

function displayValue(param: CodeParam, raw: string): string | number | boolean {
  if (param.type === 'number') {
    const n = Number(raw)
    return Number.isNaN(n) ? 0 : n
  }
  if (param.type === 'boolean') return raw === 'true'
  const match = raw.match(/^["'\`]([\\s\\S]*)["'\`]$/)
  return match ? match[1] : raw
}

export function ParamPanel({ params, overrides, onChange }: ParamPanelProps) {
  return (
    <div className="lc-panel lc-param-panel">
      <div className="lc-panel-title">Parameters</div>
      {params.length === 0 ? (
        <div className="lc-empty">No top-level constants found</div>
      ) : (
        <div className="lc-param-list">
          {params.map((p) => {
            const raw = overrides[p.name] ?? p.original
            const value = displayValue(p, raw)
            return (
              <label key={p.name} className="lc-param-row">
                <span className="lc-param-name">{p.name}</span>
                {p.type === 'boolean' ? (
                  <input
                    type="checkbox"
                    checked={value as boolean}
                    onChange={(e) => onChange(p.name, String(e.target.checked))}
                  />
                ) : p.type === 'number' ? (
                  <input
                    type="number"
                    value={value as number}
                    onChange={(e) => onChange(p.name, e.target.value === '' ? '0' : e.target.value)}
                  />
                ) : (
                  <input
                    type="text"
                    value={value as string}
                    onChange={(e) => onChange(p.name, JSON.stringify(e.target.value))}
                  />
                )}
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}
`,"src/apps/lifecycle/components/TargetPicker.tsx":`import type { Candidate } from '../types'

interface TargetPickerProps {
  candidates: Candidate[]
  selected: string | undefined
  onSelect: (name: string) => void
}

export function TargetPicker({ candidates, selected, onSelect }: TargetPickerProps) {
  return (
    <div className="lc-panel lc-target-picker">
      <div className="lc-panel-title">Target</div>
      {candidates.length === 0 ? (
        <div className="lc-empty">No top-level object or array found</div>
      ) : (
        <div className="lc-pill-row">
          {candidates.map((c) => (
            <button
              key={c.name}
              type="button"
              className={\`lc-pill\${selected === c.name ? ' lc-pill-selected' : ''}\`}
              onClick={() => onSelect(c.name)}
            >
              <span className="lc-pill-name">{c.name}</span>
              <span className="lc-pill-kind">{c.kind}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
`,"src/apps/lifecycle/components/Timeline.tsx":`import { useMemo, useState } from 'react'
import type { Entity, LifeEvent } from '../types'

interface TimelineProps {
  events: LifeEvent[]
  entities: Entity[]
  hoveredStep: number | undefined
  onHoverStep: (step: number | undefined) => void
}

function preview(value: unknown): string {
  if (value === undefined) return ''
  let json: string
  try {
    json = JSON.stringify(value) ?? String(value)
  } catch {
    return String(value)
  }
  return json.length > 60 ? \`\${json.slice(0, 60)}…\` : json
}

export function Timeline({ events, entities, hoveredStep, onHoverStep }: TimelineProps) {
  const [expandedId, setExpandedId] = useState<string | undefined>(undefined)

  const nameByEntity = useMemo(() => new Map(entities.map((e) => [e.id, e.name])), [entities])
  const colorClassByEntity = useMemo(
    () => new Map(entities.map((e, i) => [e.id, \`lc-entity-c\${i % 8}\`])),
    [entities],
  )

  return (
    <div className="lc-panel lc-timeline">
      <div className="lc-panel-title">Timeline</div>
      {events.length === 0 ? (
        <div className="lc-empty">Run a trace to see events</div>
      ) : (
        <ol className="lc-timeline-list">
          {events.map((ev) => {
            const isHovered = ev.step === hoveredStep
            const isExpanded = expandedId === ev.id
            return (
              <li
                key={ev.id}
                className={\`lc-timeline-row lc-kind-\${ev.kind}\${isHovered ? ' lc-timeline-row-active' : ''}\`}
                onMouseEnter={() => onHoverStep(ev.step)}
                onMouseLeave={() => onHoverStep(undefined)}
                onClick={() => setExpandedId(isExpanded ? undefined : ev.id)}
              >
                <span className="lc-timeline-stripe" />
                <span className="lc-timeline-step">{ev.step}</span>
                <span className={\`lc-timeline-entity \${colorClassByEntity.get(ev.entityId) ?? ''}\`}>
                  {nameByEntity.get(ev.entityId) ?? ev.entityId}
                </span>
                <span className={\`lc-badge lc-badge-\${ev.kind}\`}>{ev.kind}</span>
                <span className="lc-timeline-detail">{ev.detail}</span>
                {ev.value === undefined ? null : isExpanded ? (
                  <pre className="lc-timeline-value-full">{JSON.stringify(ev.value, null, 2)}</pre>
                ) : (
                  <span className="lc-timeline-value">{preview(ev.value)}</span>
                )}
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}
`,"src/apps/lifecycle/index.tsx":`/*
 * Lifecycle — App entry point.
 *
 * The Shell imports this module lazily and renders its default export.
 * (lifecycle.css is imported by LifecycleApp itself.)
 */
import LifecycleApp from './LifecycleApp'

export default LifecycleApp
`,"src/apps/lifecycle/lifecycle.css":`.lc-app {
  --lc-bg: #0b0e13;
  --lc-panel: #141922;
  --lc-hairline: #242c39;
  --lc-text: #e6ecf3;
  --lc-dim: #8b95a5;
  --lc-faint: #5a6474;
  --lc-accent: #7dd3fc;
  --lc-read: #a5b4fc;
  --lc-write: #fca5a5;
  --lc-method: #fcd34d;
  --lc-derive: #86efac;
  --lc-iterate: #c4b5fd;
  --lc-create: #7dd3fc;
  --lc-delete: #f87171;
  --lc-error: #f87171;

  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  background: var(--lc-bg);
  color: var(--lc-text);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, Roboto, sans-serif;
  overflow: hidden;
}

.lc-app textarea,
.lc-app input,
.lc-app pre,
.lc-app code {
  user-select: text;
  -webkit-user-select: text;
}

/* ---------- Header ---------- */

.lc-header {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 18px;
  border-bottom: 1px solid var(--lc-hairline);
  background: var(--lc-panel);
}

.lc-title {
  font-size: 15px;
  font-weight: 650;
  letter-spacing: -0.01em;
  margin-right: auto;
}

.lc-trace-btn {
  padding: 7px 16px;
  border-radius: 7px;
  background: var(--lc-accent);
  color: #06222f;
  font-size: 13px;
  font-weight: 650;
  transition: transform 0.1s, opacity 0.1s;
}

.lc-trace-btn:active {
  transform: scale(0.96);
}

.lc-trace-btn:disabled {
  opacity: 0.4;
  cursor: default;
}

.lc-status {
  min-width: 90px;
  font-size: 12px;
  color: var(--lc-dim);
  font-variant-numeric: tabular-nums;
}

.lc-status-ok {
  color: var(--lc-dim);
}

.lc-spinner {
  display: inline-flex;
  gap: 4px;
  align-items: center;
}

.lc-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--lc-accent);
  animation: lc-pulse 1s ease-in-out infinite;
}

.lc-dot:nth-child(2) {
  animation-delay: 0.15s;
}

.lc-dot:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes lc-pulse {
  0%, 80%, 100% {
    opacity: 0.25;
    transform: scale(0.8);
  }
  40% {
    opacity: 1;
    transform: scale(1.15);
  }
}

/* ---------- Body layout ---------- */

.lc-body {
  flex: 1;
  min-height: 0;
  display: flex;
  gap: 10px;
  padding: 10px;
  overflow: hidden;
}

.lc-left {
  flex: 0 0 40%;
  min-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
}

.lc-right {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
}

@media (max-width: 1023px) {
  .lc-body {
    flex-direction: column;
    overflow-y: auto;
  }

  .lc-left,
  .lc-right {
    flex: none;
    min-width: 0;
  }

  .lc-editor {
    max-height: 260px;
  }
}

/* ---------- Shared panel chrome ---------- */

.lc-panel {
  background: var(--lc-panel);
  border: 1px solid var(--lc-hairline);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.lc-panel-title {
  flex: 0 0 auto;
  padding: 7px 10px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--lc-faint);
  border-bottom: 1px solid var(--lc-hairline);
}

.lc-empty {
  padding: 14px 10px;
  color: var(--lc-faint);
  font-size: 12px;
}

/* ---------- Code editor ---------- */

.lc-editor {
  flex: 1 1 auto;
  min-height: 160px;
  display: flex;
  background: var(--lc-panel);
  border: 1px solid var(--lc-hairline);
  border-radius: 8px;
  overflow: hidden;
  font-family: 'SF Mono', ui-monospace, Menlo, Consolas, monospace;
  font-size: 12.5px;
  line-height: 19px;
}

.lc-editor-gutter {
  flex: 0 0 auto;
  margin: 0;
  padding: 10px 8px;
  text-align: right;
  color: var(--lc-faint);
  background: #10151d;
  border-right: 1px solid var(--lc-hairline);
  overflow: hidden;
  white-space: pre;
  user-select: none;
  -webkit-user-select: none;
}

.lc-editor-textarea {
  flex: 1;
  min-width: 0;
  resize: none;
  border: none;
  outline: none;
  padding: 10px 12px;
  background: transparent;
  color: var(--lc-text);
  font: inherit;
  line-height: inherit;
  white-space: pre;
  overflow: auto;
}

.lc-parse-error {
  flex: 0 0 auto;
  padding: 6px 10px;
  font-size: 11px;
  color: var(--lc-error);
  background: rgba(248, 113, 113, 0.08);
  border-top: 1px solid var(--lc-hairline);
}

/* ---------- Pills (target picker) ---------- */

.lc-target-picker,
.lc-param-panel {
  flex: 0 0 auto;
  max-height: 30%;
  overflow-y: auto;
}

.lc-pill-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 8px 10px;
}

.lc-pill {
  display: flex;
  align-items: baseline;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 999px;
  background: #10151d;
  border: 1px solid var(--lc-hairline);
  color: var(--lc-dim);
  font-size: 12px;
  transition: border-color 0.12s, color 0.12s;
}

.lc-pill:hover {
  border-color: var(--lc-faint);
}

.lc-pill-selected {
  border-color: var(--lc-accent);
  color: var(--lc-accent);
}

.lc-pill-name {
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-weight: 600;
}

.lc-pill-kind {
  font-size: 10px;
  color: var(--lc-faint);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.lc-pill-selected .lc-pill-kind {
  color: var(--lc-accent);
  opacity: 0.75;
}

/* ---------- Params ---------- */

.lc-param-list {
  display: flex;
  flex-direction: column;
  padding: 4px 10px 8px;
}

.lc-param-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 5px 0;
  border-bottom: 1px solid var(--lc-hairline);
}

.lc-param-row:last-child {
  border-bottom: none;
}

.lc-param-name {
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 12px;
  color: var(--lc-dim);
}

.lc-param-row input[type='text'],
.lc-param-row input[type='number'] {
  width: 120px;
  padding: 4px 7px;
  border-radius: 5px;
  background: #10151d;
  border: 1px solid var(--lc-hairline);
  color: var(--lc-text);
  font-size: 12px;
  text-align: right;
}

.lc-param-row input[type='text']:focus,
.lc-param-row input[type='number']:focus {
  outline: 1px solid var(--lc-accent);
}

.lc-param-row input[type='checkbox'] {
  width: 15px;
  height: 15px;
  accent-color: var(--lc-accent);
}

/* ---------- Error banner ---------- */

.lc-error-banner {
  flex: 0 0 auto;
  padding: 8px 12px;
  border-radius: 8px;
  background: rgba(248, 113, 113, 0.1);
  border: 1px solid var(--lc-error);
  color: var(--lc-error);
  font-size: 12.5px;
}

/* ---------- Graph ---------- */

.lc-graph-section {
  flex: 0 0 auto;
  max-height: 40%;
  display: flex;
}

.lc-graph {
  flex: 1;
  min-height: 0;
}

.lc-graph-scroll {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 6px;
}

.lc-graph-svg text {
  font-family: ui-monospace, Menlo, Consolas, monospace;
  fill: var(--lc-text);
  font-size: 10px;
}

.lc-node rect {
  fill: #10151d;
  stroke: var(--lc-hairline);
  stroke-width: 1.5;
  transition: stroke 0.12s, fill 0.12s;
}

.lc-node-derived rect {
  stroke-dasharray: 3 2;
}

.lc-node-name {
  font-weight: 650;
  font-size: 11px;
}

.lc-node-kind {
  fill: var(--lc-faint);
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.lc-node-active rect {
  stroke: var(--lc-accent);
  fill: #142230;
}

.lc-edge path {
  fill: none;
  stroke: var(--lc-derive);
  stroke-width: 1.4;
  opacity: 0.55;
}

.lc-edge text {
  fill: var(--lc-derive);
  font-size: 9px;
  opacity: 0.85;
}

.lc-edge-active path {
  stroke: var(--lc-accent);
  stroke-width: 2;
  opacity: 1;
}

.lc-edge-active text {
  fill: var(--lc-accent);
  opacity: 1;
}

/* ---------- Timeline ---------- */

.lc-timeline-section {
  flex: 1;
  min-height: 0;
  display: flex;
}

.lc-timeline {
  flex: 1;
  min-height: 0;
}

.lc-timeline-list {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  list-style: none;
  margin: 0;
  padding: 0;
}

.lc-timeline-row {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px;
  padding: 6px 10px 6px 14px;
  border-bottom: 1px solid var(--lc-hairline);
  font-size: 12px;
  cursor: pointer;
}

.lc-timeline-row:hover,
.lc-timeline-row-active {
  background: rgba(125, 211, 252, 0.06);
}

.lc-timeline-stripe {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
}

.lc-kind-create .lc-timeline-stripe { background: var(--lc-create); }
.lc-kind-read .lc-timeline-stripe { background: var(--lc-read); }
.lc-kind-write .lc-timeline-stripe { background: var(--lc-write); }
.lc-kind-delete .lc-timeline-stripe { background: var(--lc-delete); }
.lc-kind-method .lc-timeline-stripe { background: var(--lc-method); }
.lc-kind-iterate .lc-timeline-stripe { background: var(--lc-iterate); }
.lc-kind-derive .lc-timeline-stripe { background: var(--lc-derive); }

.lc-timeline-step {
  flex: 0 0 auto;
  width: 26px;
  color: var(--lc-faint);
  font-variant-numeric: tabular-nums;
  font-family: ui-monospace, Menlo, Consolas, monospace;
}

.lc-timeline-entity {
  flex: 0 0 auto;
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-weight: 600;
}

.lc-entity-c0 { color: #7dd3fc; }
.lc-entity-c1 { color: #86efac; }
.lc-entity-c2 { color: #fcd34d; }
.lc-entity-c3 { color: #f9a8d4; }
.lc-entity-c4 { color: #c4b5fd; }
.lc-entity-c5 { color: #fca5a5; }
.lc-entity-c6 { color: #67e8f9; }
.lc-entity-c7 { color: #bef264; }

.lc-badge {
  flex: 0 0 auto;
  padding: 1px 7px;
  border-radius: 999px;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.lc-badge-create { color: var(--lc-create); background: rgba(125, 211, 252, 0.12); }
.lc-badge-read { color: var(--lc-read); background: rgba(165, 180, 252, 0.12); }
.lc-badge-write { color: var(--lc-write); background: rgba(252, 165, 165, 0.12); }
.lc-badge-delete { color: var(--lc-delete); background: rgba(248, 113, 113, 0.12); }
.lc-badge-method { color: var(--lc-method); background: rgba(252, 211, 77, 0.12); }
.lc-badge-iterate { color: var(--lc-iterate); background: rgba(196, 181, 253, 0.12); }
.lc-badge-derive { color: var(--lc-derive); background: rgba(134, 239, 172, 0.12); }

.lc-badge-taken { color: var(--lc-derive); background: rgba(134, 239, 172, 0.12); }
.lc-badge-skipped { color: var(--lc-faint); background: rgba(90, 100, 116, 0.14); }

.lc-timeline-detail {
  color: var(--lc-text);
  font-family: ui-monospace, Menlo, Consolas, monospace;
}

.lc-timeline-value {
  color: var(--lc-dim);
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 11px;
}

.lc-timeline-value-full {
  flex: 1 0 100%;
  margin: 4px 0 0;
  padding: 6px 8px;
  background: #10151d;
  border: 1px solid var(--lc-hairline);
  border-radius: 5px;
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 11px;
  color: var(--lc-text);
  overflow-x: auto;
  max-height: 160px;
  overflow-y: auto;
}

/* ---------- Bottom row: branches + logs ---------- */

.lc-bottom-row {
  flex: 0 0 auto;
  max-height: 28%;
  display: flex;
  gap: 10px;
}

.lc-branch-list,
.lc-log-panel {
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.lc-branch-items {
  list-style: none;
  margin: 0;
  padding: 4px 0;
  overflow-y: auto;
}

.lc-branch-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px;
  font-size: 11.5px;
}

.lc-branch-line {
  color: var(--lc-faint);
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 10px;
}

.lc-branch-cond {
  color: var(--lc-text);
  font-family: ui-monospace, Menlo, Consolas, monospace;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lc-log-body {
  margin: 0;
  padding: 8px 10px;
  overflow: auto;
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 11.5px;
  color: var(--lc-dim);
  white-space: pre-wrap;
}
`,"src/apps/lifecycle/parser.ts":`/**
 * Hand-rolled top-level scanner for the Object Lifecycle Visualizer.
 * No AST/parser dependency: we track only enough state (a bracket-depth
 * counter plus atom skipping for comments/strings/regex) to find
 * top-level \`const|let|var\` declarations and \`if (...)\` conditions
 * anywhere in the source.
 */
import type { Branch, Candidate, CodeParam, ParseResult } from './types'

const OPENERS = '{[('
const CLOSERS = '}])'
const DECL_KEYWORDS = ['const', 'let', 'var'] as const

function isIdentStart(ch: string): boolean {
  return ch === '_' || ch === '$' || (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')
}

function isIdentPart(ch: string): boolean {
  return isIdentStart(ch) || (ch >= '0' && ch <= '9')
}

function skipLineComment(source: string, i: number): number {
  let j = i + 2
  while (j < source.length && source[j] !== '\\n') j++
  return j
}

function skipBlockComment(source: string, i: number): number {
  let j = i + 2
  while (j < source.length && !(source[j] === '*' && source[j + 1] === '/')) j++
  return Math.min(j + 2, source.length)
}

function skipQuoted(source: string, i: number, quote: string): number {
  let j = i + 1
  while (j < source.length) {
    if (source[j] === '\\\\') {
      j += 2
      continue
    }
    if (source[j] === quote) return j + 1
    j++
  }
  return j
}

/** Template literals are scanned as one atom; \`\${…}\` interpolations recurse via skipBalanced. */
function skipTemplate(source: string, i: number): number {
  let j = i + 1
  while (j < source.length) {
    const ch = source[j]
    if (ch === '\\\\') {
      j += 2
      continue
    }
    if (ch === '\`') return j + 1
    if (ch === '$' && source[j + 1] === '{') {
      j = skipBalanced(source, j + 1)
      continue
    }
    j++
  }
  return j
}

/** Best-effort lookback used only to disambiguate \`/\` (division vs regex start). */
function precedingToken(source: string, i: number): string {
  let j = i - 1
  while (j >= 0 && (source[j] === ' ' || source[j] === '\\t' || source[j] === '\\n' || source[j] === '\\r')) j--
  if (j < 0) return ''
  if (isIdentPart(source[j])) {
    let k = j
    while (k >= 0 && isIdentPart(source[k])) k--
    return source.slice(k + 1, j + 1)
  }
  return source[j]
}

const REGEX_START_TOKENS = new Set(['=', '(', ',', ';', '{', '[', ':', '!', '&', '|', '?', 'return'])

function regexCanStart(source: string, i: number): boolean {
  const tok = precedingToken(source, i)
  return tok === '' || REGEX_START_TOKENS.has(tok)
}

function skipRegex(source: string, i: number): number {
  let j = i + 1
  let inClass = false
  while (j < source.length) {
    const ch = source[j]
    if (ch === '\\\\') {
      j += 2
      continue
    }
    if (ch === '\\n') break
    if (ch === '[') inClass = true
    else if (ch === ']') inClass = false
    else if (ch === '/' && !inClass) {
      j++
      break
    }
    j++
  }
  while (j < source.length && /[a-z]/i.test(source[j])) j++
  return j
}

/** Consumes one opaque token (comment/string/template/regex) starting at \`i\`, or returns null. */
function skipAtomAt(source: string, i: number): number | null {
  const ch = source[i]
  const next = source[i + 1]
  if (ch === '/' && next === '/') return skipLineComment(source, i)
  if (ch === '/' && next === '*') return skipBlockComment(source, i)
  if (ch === '"' || ch === "'") return skipQuoted(source, i, ch)
  if (ch === '\`') return skipTemplate(source, i)
  if (ch === '/' && regexCanStart(source, i)) return skipRegex(source, i)
  return null
}

/**
 * Assumes \`source[start]\` is one of \`{[(\`. Returns the index one past its
 * matching closer, using a plain depth counter (mixed bracket types are
 * never actually mismatched in well-formed JS, so this is safe).
 */
function skipBalanced(source: string, start: number): number {
  let depth = 0
  let i = start
  while (i < source.length) {
    const atomEnd = skipAtomAt(source, i)
    if (atomEnd !== null) {
      i = atomEnd
      continue
    }
    const ch = source[i]
    if (OPENERS.includes(ch)) {
      depth++
      i++
      continue
    }
    if (CLOSERS.includes(ch)) {
      depth--
      i++
      if (depth === 0) return i
      continue
    }
    i++
  }
  return i
}

function matchesWordAt(source: string, pos: number, word: string): boolean {
  if (!source.startsWith(word, pos)) return false
  const before = source[pos - 1]
  const after = source[pos + word.length]
  if (before !== undefined && isIdentPart(before)) return false
  if (after !== undefined && isIdentPart(after)) return false
  return true
}

function matchDeclKeyword(source: string, pos: number): (typeof DECL_KEYWORDS)[number] | null {
  for (const kw of DECL_KEYWORDS) {
    if (matchesWordAt(source, pos, kw)) return kw
  }
  return null
}

interface LiteralMatch {
  type: 'number' | 'string' | 'boolean'
  end: number
}

const NUMBER_RE = /^-?(?:\\d+\\.\\d*|\\.\\d+|\\d+)(?:[eE][+-]?\\d+)?/

function matchLiteral(source: string, pos: number): LiteralMatch | null {
  if (matchesWordAt(source, pos, 'true')) return { type: 'boolean', end: pos + 4 }
  if (matchesWordAt(source, pos, 'false')) return { type: 'boolean', end: pos + 5 }
  const ch = source[pos]
  if (ch === '"' || ch === "'") return { type: 'string', end: skipQuoted(source, pos, ch) }
  const m = NUMBER_RE.exec(source.slice(pos))
  if (m && m[0].length > 0) return { type: 'number', end: pos + m[0].length }
  return null
}

/** A literal is only a pure param value if nothing but a terminator follows it on the same line. */
function isPureLiteralTerminator(source: string, from: number): boolean {
  let p = from
  while (p < source.length && (source[p] === ' ' || source[p] === '\\t')) p++
  if (p >= source.length) return true
  const ch = source[p]
  if (ch === '\\n' || ch === '\\r' || ch === ',' || ch === ';') return true
  if (ch === ')' || ch === ']' || ch === '}') return true
  if (ch === '/' && source[p + 1] === '/') return true
  if (ch === '/' && source[p + 1] === '*') return true
  return false
}

function computeLineStarts(source: string): number[] {
  const starts = [0]
  for (let i = 0; i < source.length; i++) {
    if (source[i] === '\\n') starts.push(i + 1)
  }
  return starts
}

function lineForOffset(lineStarts: number[], offset: number): number {
  let lo = 0
  let hi = lineStarts.length - 1
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1
    if (lineStarts[mid] <= offset) lo = mid
    else hi = mid - 1
  }
  return lo + 1
}

interface Trivia {
  pos: number
  ch: string | undefined
}

/** Skips whitespace and comments (never strings/regex) to find the next significant char. */
function peekAfterTrivia(source: string, from: number): Trivia {
  let p = from
  while (p < source.length) {
    const ch = source[p]
    if (ch === ' ' || ch === '\\t' || ch === '\\n' || ch === '\\r') {
      p++
      continue
    }
    if (ch === '/' && source[p + 1] === '/') {
      p = skipLineComment(source, p)
      continue
    }
    if (ch === '/' && source[p + 1] === '*') {
      p = skipBlockComment(source, p)
      continue
    }
    break
  }
  return { pos: p, ch: source[p] }
}

export function parseCode(source: string): ParseResult {
  const candidates: Candidate[] = []
  const params: CodeParam[] = []
  const branches: Branch[] = []
  const lineStarts = computeLineStarts(source)
  const lineAt = (offset: number) => lineForOffset(lineStarts, offset)

  let pos = 0
  let depth = 0
  let error: string | undefined

  function skipExpressionValue(): void {
    let localDepth = 0
    while (pos < source.length) {
      const atomEnd = skipAtomAt(source, pos)
      if (atomEnd !== null) {
        pos = atomEnd
        continue
      }
      const ch = source[pos]
      if (localDepth === 0 && (ch === ',' || ch === ';' || ch === '\\n')) return
      if (CLOSERS.includes(ch) && localDepth === 0) return
      if (OPENERS.includes(ch)) {
        localDepth++
        pos++
        continue
      }
      if (CLOSERS.includes(ch)) {
        localDepth--
        pos++
        continue
      }
      pos++
    }
  }

  function handleDeclaration(): void {
    while (true) {
      const nameTok = peekAfterTrivia(source, pos)
      pos = nameTok.pos
      if (nameTok.ch === undefined || !isIdentStart(nameTok.ch)) return
      const nameStart = pos
      let p = pos
      while (p < source.length && isIdentPart(source[p])) p++
      const name = source.slice(nameStart, p)
      pos = p
      const bindingLine = lineAt(nameStart)

      const eq = peekAfterTrivia(source, pos)
      if (eq.ch === '=') {
        pos = eq.pos + 1
        const val = peekAfterTrivia(source, pos)
        pos = val.pos
        if (val.ch === '{' || val.ch === '[') {
          const kind = val.ch === '{' ? 'object' : 'array'
          const initStart = pos
          pos = skipBalanced(source, pos)
          candidates.push({ name, kind, line: bindingLine, initStart, initEnd: pos })
        } else {
          const lit = val.ch !== undefined ? matchLiteral(source, pos) : null
          if (lit && isPureLiteralTerminator(source, lit.end)) {
            params.push({
              name,
              type: lit.type,
              original: source.slice(pos, lit.end),
              line: bindingLine,
              literalStart: pos,
              literalEnd: lit.end,
            })
            pos = lit.end
          } else {
            skipExpressionValue()
          }
        }
      }

      const next = peekAfterTrivia(source, pos)
      if (next.ch === ',') {
        pos = next.pos + 1
        continue
      }
      return
    }
  }

  function handleIf(): void {
    const ifStart = pos
    pos += 2
    const paren = peekAfterTrivia(source, pos)
    if (paren.ch !== '(') {
      pos = paren.pos
      return
    }
    const parenStart = paren.pos
    const parenEnd = skipBalanced(source, parenStart)
    const condition = source.slice(parenStart + 1, parenEnd - 1).trim()
    const line = lineAt(ifStart)
    const col = ifStart - lineStarts[line - 1]
    branches.push({ id: \`b\${line}:\${col}\`, line, condition })
    pos = parenEnd
  }

  try {
    const maxIterations = source.length * 4 + 100
    let iterations = 0
    while (pos < source.length) {
      iterations++
      if (iterations > maxIterations) {
        error = 'parser stalled on malformed input'
        break
      }
      const startPos = pos
      const atomEnd = skipAtomAt(source, pos)
      if (atomEnd !== null) {
        pos = atomEnd
        continue
      }
      const ch = source[pos]

      if (ch === 'i' && matchesWordAt(source, pos, 'if')) {
        handleIf()
        continue
      }

      if (depth === 0) {
        const kw = matchDeclKeyword(source, pos)
        if (kw) {
          pos += kw.length
          handleDeclaration()
          continue
        }
      }

      if (OPENERS.includes(ch)) {
        depth++
        pos++
        continue
      }
      if (CLOSERS.includes(ch)) {
        depth--
        pos++
        continue
      }
      pos++
      if (pos === startPos) pos++
    }
  } catch (e) {
    error = e instanceof Error ? e.message : String(e)
  }

  return error ? { candidates, params, branches, error } : { candidates, params, branches }
}
`,"src/apps/lifecycle/sample.ts":`/** Default snippet loaded into the editor so the app has something to visualize on first open. */
export const SAMPLE_CODE = \`// A tiny order-processing pipeline. Try tracing "cart".
const taxRate = 0.08
const shippingThreshold = 50
const promo = "SAVE10"

const cart = [
  { id: 1, name: "Notebook", price: 12, qty: 2 },
  { id: 2, name: "Pen", price: 3, qty: 5 },
]

cart.push({ id: 3, name: "Sticker", price: 4, qty: 1 })

let subtotal = 0
for (const item of cart) {
  subtotal += item.price * item.qty
}

if (promo === "SAVE10") {
  subtotal = subtotal * 0.9
}

const shipping = subtotal >= shippingThreshold ? 0 : 8
const tax = subtotal * taxRate
const total = subtotal + shipping + tax

const expensive = cart.filter((i) => i.price > 5)
const names = cart.map((i) => i.name)

cart[0].qty = 3

console.log("total", total, "expensive", expensive.length, "names", names)
\`
`,"src/apps/lifecycle/tracer.ts":`/**
 * Executes user code with the target candidate wrapped in a tracking Proxy,
 * capturing every read/write/method/iterate/derive as a LifeEvent.
 *
 * This file intentionally duplicates a small tokenizer (comment/string/regex
 * skipping, \`if (...)\` detection) from parser.ts rather than importing its
 * internals, since parser.ts only exports \`parseCode\` — the two files stay
 * independently self-contained per the task split.
 */
import type { CandidateKind, CodeParam, Entity, LifeEvent, TraceOptions, TraceResult } from './types'
import { parseCode } from './parser'

// ---------------------------------------------------------------------------
// Minimal tokenizer (duplicated from parser.ts) used only to find and rewrite
// every \`if (...)\` in the source, regardless of nesting depth.
// ---------------------------------------------------------------------------

function isIdentPart(ch: string): boolean {
  return ch === '_' || ch === '$' || (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || (ch >= '0' && ch <= '9')
}

function skipLineComment(source: string, i: number): number {
  let j = i + 2
  while (j < source.length && source[j] !== '\\n') j++
  return j
}

function skipBlockComment(source: string, i: number): number {
  let j = i + 2
  while (j < source.length && !(source[j] === '*' && source[j + 1] === '/')) j++
  return Math.min(j + 2, source.length)
}

function skipQuoted(source: string, i: number, quote: string): number {
  let j = i + 1
  while (j < source.length) {
    if (source[j] === '\\\\') {
      j += 2
      continue
    }
    if (source[j] === quote) return j + 1
    j++
  }
  return j
}

function skipTemplate(source: string, i: number): number {
  let j = i + 1
  while (j < source.length) {
    const ch = source[j]
    if (ch === '\\\\') {
      j += 2
      continue
    }
    if (ch === '\`') return j + 1
    if (ch === '$' && source[j + 1] === '{') {
      j = skipBalanced(source, j + 1)
      continue
    }
    j++
  }
  return j
}

function precedingToken(source: string, i: number): string {
  let j = i - 1
  while (j >= 0 && /\\s/.test(source[j])) j--
  if (j < 0) return ''
  if (isIdentPart(source[j])) {
    let k = j
    while (k >= 0 && isIdentPart(source[k])) k--
    return source.slice(k + 1, j + 1)
  }
  return source[j]
}

const REGEX_START_TOKENS = new Set(['=', '(', ',', ';', '{', '[', ':', '!', '&', '|', '?', 'return'])

function regexCanStart(source: string, i: number): boolean {
  const tok = precedingToken(source, i)
  return tok === '' || REGEX_START_TOKENS.has(tok)
}

function skipRegex(source: string, i: number): number {
  let j = i + 1
  let inClass = false
  while (j < source.length) {
    const ch = source[j]
    if (ch === '\\\\') {
      j += 2
      continue
    }
    if (ch === '\\n') break
    if (ch === '[') inClass = true
    else if (ch === ']') inClass = false
    else if (ch === '/' && !inClass) {
      j++
      break
    }
    j++
  }
  while (j < source.length && /[a-z]/i.test(source[j])) j++
  return j
}

function skipAtomAt(source: string, i: number): number | null {
  const ch = source[i]
  const next = source[i + 1]
  if (ch === '/' && next === '/') return skipLineComment(source, i)
  if (ch === '/' && next === '*') return skipBlockComment(source, i)
  if (ch === '"' || ch === "'") return skipQuoted(source, i, ch)
  if (ch === '\`') return skipTemplate(source, i)
  if (ch === '/' && regexCanStart(source, i)) return skipRegex(source, i)
  return null
}

const OPENERS = '{[('
const CLOSERS = '}])'

function skipBalanced(source: string, start: number): number {
  let depth = 0
  let i = start
  while (i < source.length) {
    const atomEnd = skipAtomAt(source, i)
    if (atomEnd !== null) {
      i = atomEnd
      continue
    }
    const ch = source[i]
    if (OPENERS.includes(ch)) {
      depth++
      i++
      continue
    }
    if (CLOSERS.includes(ch)) {
      depth--
      i++
      if (depth === 0) return i
      continue
    }
    i++
  }
  return i
}

function matchesWordAt(source: string, pos: number, word: string): boolean {
  if (!source.startsWith(word, pos)) return false
  const before = source[pos - 1]
  const after = source[pos + word.length]
  if (before !== undefined && isIdentPart(before)) return false
  if (after !== undefined && isIdentPart(after)) return false
  return true
}

function computeLineStarts(source: string): number[] {
  const starts = [0]
  for (let i = 0; i < source.length; i++) {
    if (source[i] === '\\n') starts.push(i + 1)
  }
  return starts
}

function lineForOffset(lineStarts: number[], offset: number): number {
  let lo = 0
  let hi = lineStarts.length - 1
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1
    if (lineStarts[mid] <= offset) lo = mid
    else hi = mid - 1
  }
  return lo + 1
}

function peekAfterTrivia(source: string, from: number): { pos: number; ch: string | undefined } {
  let p = from
  while (p < source.length) {
    const ch = source[p]
    if (ch === ' ' || ch === '\\t' || ch === '\\n' || ch === '\\r') {
      p++
      continue
    }
    if (ch === '/' && source[p + 1] === '/') {
      p = skipLineComment(source, p)
      continue
    }
    if (ch === '/' && source[p + 1] === '*') {
      p = skipBlockComment(source, p)
      continue
    }
    break
  }
  return { pos: p, ch: source[p] }
}

/**
 * Rewrites every \`if (COND)\` to \`((__trace.branch(id, !!(COND)), (COND)))\`,
 * a comma expression that preserves semantics while recording the branch id
 * whenever COND is truthy. Ids use the same \`b<line>:<col>\` scheme as
 * parser.ts, so they match parseCode(originalSource)'s branch ids as long as
 * no param override changes text on the same line as an \`if\` (the common
 * case — overrides and \`if\`s normally live on different lines).
 */
function instrumentBranches(source: string): string {
  const lineStarts = computeLineStarts(source)
  let out = ''
  let lastEmit = 0
  let i = 0
  while (i < source.length) {
    const atomEnd = skipAtomAt(source, i)
    if (atomEnd !== null) {
      i = atomEnd
      continue
    }
    const ch = source[i]
    if (ch === 'i' && matchesWordAt(source, i, 'if')) {
      const ifStart = i
      const paren = peekAfterTrivia(source, i + 2)
      if (paren.ch === '(') {
        const parenStart = paren.pos
        const parenEnd = skipBalanced(source, parenStart)
        const condText = source.slice(parenStart + 1, parenEnd - 1)
        const line = lineForOffset(lineStarts, ifStart)
        const col = ifStart - lineStarts[line - 1]
        const id = \`b\${line}:\${col}\`
        out += source.slice(lastEmit, parenStart)
        out += \`((__trace.branch(\${JSON.stringify(id)}, !!(\${condText})), (\${condText})))\`
        lastEmit = parenEnd
        i = parenEnd
        continue
      }
    }
    i++
  }
  out += source.slice(lastEmit)
  return out
}

function applyParamOverrides(source: string, params: CodeParam[], overrides: Record<string, string>): string {
  const edits = params
    .filter((p) => Object.prototype.hasOwnProperty.call(overrides, p.name))
    .sort((a, b) => b.literalStart - a.literalStart)
  let out = source
  for (const p of edits) {
    out = out.slice(0, p.literalStart) + overrides[p.name] + out.slice(p.literalEnd)
  }
  return out
}

// ---------------------------------------------------------------------------
// Deterministic Math/Date shims for the sandbox.
// ---------------------------------------------------------------------------

function createSeededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
}

function makeMathShim(): typeof Math {
  const shim = Object.create(Math) as typeof Math
  Object.defineProperty(shim, 'random', { value: createSeededRandom(1), enumerable: true })
  return shim
}

function makeDateClass(): DateConstructor {
  class FixedDate extends Date {
    constructor(...args: unknown[]) {
      if (args.length === 0) super(0)
      else super(...(args as ConstructorParameters<typeof Date>))
    }
    static now(): number {
      return 0
    }
  }
  return FixedDate as unknown as DateConstructor
}

// ---------------------------------------------------------------------------
// Limit-exceeded sentinel — thrown to unwind out of running user code.
// ---------------------------------------------------------------------------

type LimitError = Error & { traceLimit: true }

function makeLimitError(message: string): LimitError {
  const err = new Error(message) as LimitError
  err.traceLimit = true
  return err
}

function isLimitError(e: unknown): e is LimitError {
  return e instanceof Error && (e as { traceLimit?: unknown }).traceLimit === true
}

// ---------------------------------------------------------------------------
// Tracer state + the \`__trace\` façade exposed to the sandboxed code.
// ---------------------------------------------------------------------------

interface TracerState {
  events: LifeEvent[]
  entities: Map<string, Entity>
  rawById: Map<string, unknown>
  logs: string[]
  branchesTaken: Set<string>
  entityCounter: number
  maxEvents: number
  timeBudgetMs: number
  startedAt: number
}

function createState(maxEvents: number, timeBudgetMs: number): TracerState {
  return {
    events: [],
    entities: new Map(),
    rawById: new Map(),
    logs: [],
    branchesTaken: new Set(),
    entityCounter: 0,
    maxEvents,
    timeBudgetMs,
    startedAt: Date.now(),
  }
}

interface TraceHandle {
  wrap: (entityId: string, name: string, kind: CandidateKind, value: unknown) => unknown
  branch: (id: string, taken: boolean) => void
  result: () => TraceResult
  math: typeof Math
  dateClass: DateConstructor
  console: { log: (...args: unknown[]) => void }
}

/**
 * Array method categories. Membership in these sets drives how the Proxy's
 * \`get\` trap dispatches — each category needs different callback / return
 * handling so tracked entities never leak as raw values to user code, and
 * user callbacks always see wrapped items.
 */
const IN_PLACE_MUTATING_METHODS = new Set(['push', 'unshift', 'fill', 'copyWithin'])
const EXTRACTING_METHODS = new Set(['pop', 'shift', 'splice'])
const REVERSING_METHODS = new Set(['reverse'])
const SORT_METHODS = new Set(['sort'])
const CB_ITEM_METHODS = new Set(['forEach', 'find', 'findIndex', 'findLast', 'findLastIndex', 'some', 'every'])
const CB_ITEM_DERIVE_METHODS = new Set(['map', 'filter', 'flatMap'])
const CB_ACC_ITEM_METHODS = new Set(['reduce', 'reduceRight'])
const NO_CB_DERIVE_METHODS = new Set(['slice', 'concat', 'flat'])

function propLabel(prop: string): string {
  return /^\\d+$/.test(prop) ? \`[\${prop}]\` : \`.\${prop}\`
}

function joinPath(base: string, prop: string): string {
  return base === '' ? prop : \`\${base}.\${prop}\`
}

function callAsFunction(target: unknown, methodName: string, args: unknown[]): unknown {
  const fn = (target as Record<string, unknown>)[methodName] as (...a: unknown[]) => unknown
  return fn.apply(target, args)
}

function createTraceHandle(state: TracerState): TraceHandle {
  const rawByProxy = new WeakMap<object, unknown>()

  function checkLimits(): void {
    if (state.events.length >= state.maxEvents) {
      throw makeLimitError(\`stopped after reaching the \${state.maxEvents}-event limit\`)
    }
    if (Date.now() - state.startedAt > state.timeBudgetMs) {
      throw makeLimitError(\`stopped after exceeding the \${state.timeBudgetMs}ms time budget\`)
    }
  }

  function pushEvent(partial: Omit<LifeEvent, 'id' | 'step'>): void {
    checkLimits()
    const step = state.events.length
    state.events.push({ id: \`ev\${step}\`, step, ...partial })
  }

  function snapshot(value: unknown, depth: number, seen: Set<unknown>): unknown {
    if (value === null) return null
    const t = typeof value
    if (t === 'function') {
      const name = (value as { name?: string }).name
      return \`[fn \${name || 'anonymous'}]\`
    }
    if (t === 'symbol') return (value as symbol).toString()
    if (t !== 'object') return value

    const raw = rawByProxy.get(value as object) ?? value
    if (typeof raw === 'function') {
      const name = (raw as { name?: string }).name
      return \`[fn \${name || 'anonymous'}]\`
    }
    if (typeof raw !== 'object' || raw === null) return raw as unknown
    if (seen.has(raw)) return '[cyclic]'
    if (depth > 6) return '[deep]'

    seen.add(raw)
    let result: unknown
    if (Array.isArray(raw)) {
      result = raw.map((item) => snapshot(item, depth + 1, seen))
    } else {
      const out: Record<string, unknown> = {}
      for (const key of Object.keys(raw as Record<string, unknown>)) {
        out[key] = snapshot((raw as Record<string, unknown>)[key], depth + 1, seen)
      }
      result = out
    }
    seen.delete(raw)
    return result
  }

  function safeStringify(value: unknown): string {
    if (typeof value === 'string') return value
    if (value === null || value === undefined) return String(value)
    if (typeof value === 'object' || typeof value === 'function') {
      const snap = snapshot(value, 0, new Set())
      try {
        return JSON.stringify(snap) ?? String(snap)
      } catch {
        return String(snap)
      }
    }
    return String(value)
  }

  function previewArgs(args: unknown[]): string {
    return args
      .map((a) => {
        const snap = snapshot(a, 0, new Set())
        try {
          return JSON.stringify(snap) ?? String(snap)
        } catch {
          return String(snap)
        }
      })
      .join(', ')
  }

  function unwrapIfProxy(value: unknown): unknown {
    if (value === null || typeof value !== 'object') return value
    return rawByProxy.has(value) ? rawByProxy.get(value) : value
  }

  function wrapValue(entityId: string, path: string, raw: unknown, entityName: string): unknown {
    if (raw === null || typeof raw !== 'object') return raw
    const proxy = new Proxy(raw, makeHandler(entityId, path, entityName))
    rawByProxy.set(proxy, raw)
    return proxy
  }

  function registerEntity(id: string, name: string, kind: CandidateKind, parentId: string | undefined, raw: unknown): void {
    state.entities.set(id, { id, name, kind, parentId, bornAtStep: state.events.length, finalValue: undefined })
    state.rawById.set(id, raw)
  }

  /** Wrap a callback so its item arg gets a Proxy and any returned Proxy is
   *  unwrapped before the native method sees it (so map/filter don't end up
   *  producing arrays of proxies). */
  function wrapItemCallback(
    entityId: string,
    entityName: string,
    cb: unknown,
    itemArgIndex: number,
    unwrapReturn: boolean,
  ): unknown {
    if (typeof cb !== 'function') return cb
    const fn = cb as (...a: unknown[]) => unknown
    return (...cbArgs: unknown[]) => {
      const item = cbArgs[itemArgIndex]
      const idx = cbArgs[itemArgIndex + 1]
      if (item !== null && typeof item === 'object') {
        const idxPath = typeof idx === 'number' ? String(idx) : ''
        cbArgs[itemArgIndex] = wrapValue(entityId, idxPath, item, entityName)
      }
      const result = fn(...cbArgs)
      return unwrapReturn ? unwrapIfProxy(result) : result
    }
  }

  /** Wrap a sort comparator so both compared elements are proxied. */
  function wrapCompareCallback(entityId: string, entityName: string, cb: unknown): unknown {
    if (typeof cb !== 'function') return cb
    const fn = cb as (a: unknown, b: unknown) => number
    return (a: unknown, b: unknown) => {
      const wa = a !== null && typeof a === 'object' ? wrapValue(entityId, '', a, entityName) : a
      const wb = b !== null && typeof b === 'object' ? wrapValue(entityId, '', b, entityName) : b
      return fn(wa, wb)
    }
  }

  /** Wrap a value that just came out of the target (extracted from pop/shift/
   *  splice, yielded by an iterator) so mutations through it stay tracked. */
  function wrapExtracted(entityId: string, entityName: string, value: unknown): unknown {
    if (value === null || typeof value !== 'object') return value
    return wrapValue(entityId, '', value, entityName)
  }

  function recordMethodEvent(
    entityId: string,
    basePath: string,
    prop: string,
    rawArgs: unknown[],
    target: unknown,
  ): void {
    pushEvent({
      kind: 'method',
      entityId,
      path: basePath,
      detail: \`\${prop}(\${previewArgs(rawArgs)})\`,
      value: snapshot(target, 0, new Set()),
      args: rawArgs.map((a) => snapshot(a, 0, new Set())),
    })
  }

  function recordDeriveEvent(
    entityId: string,
    basePath: string,
    prop: string,
    rawArgs: unknown[],
    rawResult: unknown,
    entityName: string,
  ): { newId: string; newName: string } {
    const n = ++state.entityCounter
    const newId = \`e\${n}\`
    const newName = \`\${entityName}.\${prop}(…)#\${n}\`
    registerEntity(newId, newName, 'array', entityId, rawResult)
    pushEvent({
      kind: 'derive',
      entityId,
      path: basePath,
      detail: \`\${prop}(\${previewArgs(rawArgs)})\`,
      value: snapshot(rawResult, 0, new Set()),
      args: rawArgs.map((a) => snapshot(a, 0, new Set())),
      producedId: newId,
    })
    return { newId, newName }
  }

  function makeHandler(entityId: string, basePath: string, entityName: string): ProxyHandler<object> {
    return {
      get(target, prop, _receiver) {
        if (prop === Symbol.iterator) {
          pushEvent({ kind: 'iterate', entityId, path: basePath, detail: 'iterate' })
          const nativeIter = (Reflect.get(target, prop, target) as () => Iterator<unknown>).bind(target)
          return () => {
            const it = nativeIter()
            return {
              next: () => {
                const step = it.next()
                if (step.done) return step
                const wrapped =
                  step.value !== null && typeof step.value === 'object'
                    ? wrapValue(entityId, '', step.value, entityName)
                    : step.value
                return { value: wrapped, done: false }
              },
              return: (v?: unknown) => (typeof it.return === 'function' ? it.return(v) : { value: v, done: true }),
              throw: (e?: unknown) => {
                if (typeof it.throw === 'function') return it.throw(e)
                throw e
              },
              [Symbol.iterator]() {
                return this
              },
            }
          }
        }
        if (prop === Symbol.toPrimitive) {
          pushEvent({ kind: 'iterate', entityId, path: basePath, detail: 'toPrimitive' })
          const fn = Reflect.get(target, prop, target) as unknown
          return typeof fn === 'function' ? (fn as (...a: unknown[]) => unknown).bind(target) : fn
        }
        if (typeof prop === 'symbol') {
          return Reflect.get(target, prop, target) as unknown
        }

        if (Array.isArray(target)) {
          if (IN_PLACE_MUTATING_METHODS.has(prop)) {
            return (...args: unknown[]) => {
              const rawArgs = args.map(unwrapIfProxy)
              callAsFunction(target, prop, rawArgs)
              recordMethodEvent(entityId, basePath, prop, rawArgs, target)
              return _receiver
            }
          }

          if (EXTRACTING_METHODS.has(prop)) {
            return (...args: unknown[]) => {
              const rawArgs = args.map(unwrapIfProxy)
              const outcome = callAsFunction(target, prop, rawArgs)
              recordMethodEvent(entityId, basePath, prop, rawArgs, target)
              if (prop === 'splice' && Array.isArray(outcome)) {
                return outcome.map((v) => wrapExtracted(entityId, entityName, v))
              }
              return wrapExtracted(entityId, entityName, outcome)
            }
          }

          if (REVERSING_METHODS.has(prop)) {
            return (...args: unknown[]) => {
              const rawArgs = args.map(unwrapIfProxy)
              callAsFunction(target, prop, rawArgs)
              recordMethodEvent(entityId, basePath, prop, rawArgs, target)
              return _receiver
            }
          }

          if (SORT_METHODS.has(prop)) {
            return (...args: unknown[]) => {
              const wrappedArgs = args.length > 0 ? [wrapCompareCallback(entityId, entityName, args[0])] : []
              const rawArgs = args.map(unwrapIfProxy)
              callAsFunction(target, prop, wrappedArgs)
              recordMethodEvent(entityId, basePath, prop, rawArgs, target)
              return _receiver
            }
          }

          if (CB_ITEM_METHODS.has(prop)) {
            return (...args: unknown[]) => {
              const rawArgs = args.map(unwrapIfProxy)
              const wrappedArgs =
                args.length > 0 ? [wrapItemCallback(entityId, entityName, args[0], 0, false), ...args.slice(1)] : []
              pushEvent({
                kind: 'iterate',
                entityId,
                path: basePath,
                detail: \`\${prop}(\${previewArgs(rawArgs)})\`,
                args: rawArgs.map((a) => snapshot(a, 0, new Set())),
              })
              return callAsFunction(target, prop, wrappedArgs)
            }
          }

          if (CB_ITEM_DERIVE_METHODS.has(prop)) {
            return (...args: unknown[]) => {
              const rawArgs = args.map(unwrapIfProxy)
              const wrappedArgs =
                args.length > 0 ? [wrapItemCallback(entityId, entityName, args[0], 0, true), ...args.slice(1)] : []
              const rawResult = callAsFunction(target, prop, wrappedArgs)
              const { newId, newName } = recordDeriveEvent(entityId, basePath, prop, rawArgs, rawResult, entityName)
              return wrapValue(newId, '', rawResult, newName)
            }
          }

          if (CB_ACC_ITEM_METHODS.has(prop)) {
            return (...args: unknown[]) => {
              const rawArgs = args.map(unwrapIfProxy)
              const wrappedArgs =
                args.length > 0 ? [wrapItemCallback(entityId, entityName, args[0], 1, true), ...args.slice(1)] : []
              pushEvent({
                kind: 'iterate',
                entityId,
                path: basePath,
                detail: \`\${prop}(\${previewArgs(rawArgs)})\`,
                args: rawArgs.map((a) => snapshot(a, 0, new Set())),
              })
              const rawResult = callAsFunction(target, prop, wrappedArgs)
              return unwrapIfProxy(rawResult)
            }
          }

          if (NO_CB_DERIVE_METHODS.has(prop)) {
            return (...args: unknown[]) => {
              const rawArgs = args.map(unwrapIfProxy)
              const rawResult = callAsFunction(target, prop, rawArgs)
              const { newId, newName } = recordDeriveEvent(entityId, basePath, prop, rawArgs, rawResult, entityName)
              return wrapValue(newId, '', rawResult, newName)
            }
          }
        }

        const raw: unknown = Reflect.get(target, prop, target)
        const path = joinPath(basePath, prop)
        pushEvent({
          kind: 'read',
          entityId,
          path,
          detail: \`read \${propLabel(prop)}\`,
          value: typeof raw === 'object' && raw !== null ? undefined : snapshot(raw, 0, new Set()),
        })
        if (typeof raw === 'function') return (raw as (...a: unknown[]) => unknown).bind(target)
        if (raw !== null && typeof raw === 'object') return wrapValue(entityId, path, raw, entityName)
        return raw
      },
      set(target, prop, value, _receiver) {
        if (typeof prop === 'symbol') return Reflect.set(target, prop, value, target)
        const rawValue = unwrapIfProxy(value)
        const path = joinPath(basePath, prop)
        const ok = Reflect.set(target, prop, rawValue, target)
        pushEvent({ kind: 'write', entityId, path, detail: \`write \${propLabel(prop)}\`, value: snapshot(rawValue, 0, new Set()) })
        return ok
      },
      deleteProperty(target, prop) {
        if (typeof prop === 'symbol') return Reflect.deleteProperty(target, prop)
        const path = joinPath(basePath, prop)
        const ok = Reflect.deleteProperty(target, prop)
        pushEvent({ kind: 'delete', entityId, path, detail: \`delete \${propLabel(prop)}\` })
        return ok
      },
    }
  }

  return {
    wrap(entityId, name, kind, value) {
      registerEntity(entityId, name, kind, undefined, value)
      pushEvent({ kind: 'create', entityId, path: '', detail: \`create \${name}\`, value: snapshot(value, 0, new Set()) })
      return wrapValue(entityId, '', value, name)
    },
    branch(id, taken) {
      checkLimits()
      if (taken) state.branchesTaken.add(id)
    },
    result() {
      const entities: Entity[] = []
      for (const e of state.entities.values()) {
        entities.push({ ...e, finalValue: snapshot(state.rawById.get(e.id), 0, new Set()) })
      }
      return {
        entities,
        events: state.events,
        branchesTaken: Array.from(state.branchesTaken),
        logs: state.logs,
      }
    },
    math: makeMathShim(),
    dateClass: makeDateClass(),
    console: {
      log(...args: unknown[]) {
        state.logs.push(args.map((a) => safeStringify(a)).join(' '))
      },
    },
  }
}

// ---------------------------------------------------------------------------
// Public entry point.
// ---------------------------------------------------------------------------

export function trace(source: string, opts: TraceOptions): TraceResult {
  const maxEvents = opts.maxEvents ?? 5000
  const timeBudgetMs = opts.timeBudgetMs ?? 250

  const parsed1 = parseCode(source)
  const overridden = applyParamOverrides(source, parsed1.params, opts.paramOverrides ?? {})
  const parsed2 = parseCode(overridden)
  const target = parsed2.candidates.find((c) => c.name === opts.target)

  if (!target) {
    return { entities: [], events: [], branchesTaken: [], logs: [], error: \`target "\${opts.target}" not found\` }
  }

  const wrapped =
    overridden.slice(0, target.initStart) +
    \`__trace.wrap(\${JSON.stringify('root')}, \${JSON.stringify(target.name)}, \${JSON.stringify(target.kind)}, \` +
    overridden.slice(target.initStart, target.initEnd) +
    ')' +
    overridden.slice(target.initEnd)

  const instrumented = instrumentBranches(wrapped)

  const state = createState(maxEvents, timeBudgetMs)
  const handle = createTraceHandle(state)

  const body =
    "'use strict';\\n" +
    'const Math = __trace.math, Date = __trace.dateClass, console = __trace.console;\\n' +
    instrumented +
    '\\n;return __trace.result();'

  try {
    const fn = new Function('__trace', body) as (t: TraceHandle) => TraceResult
    return fn(handle)
  } catch (e) {
    const message = isLimitError(e) ? e.message : e instanceof Error ? e.message : String(e)
    return { ...handle.result(), error: message }
  }
}
`,"src/apps/lifecycle/types.ts":`/**
 * Shared types for the Object Lifecycle Visualizer.
 * The parser produces these, the tracer produces these, the UI consumes these.
 * Nothing in here depends on React or the DOM.
 */

// ---------------------------------------------------------------------------
// Parser output
// ---------------------------------------------------------------------------

export type CandidateKind = 'object' | 'array'

/** A top-level \`const|let|var IDENT = {…}\` or \`[…]\` the user can target. */
export interface Candidate {
  name: string
  kind: CandidateKind
  /** 1-indexed line of the declaration. */
  line: number
  /** Absolute char offset of the initializer literal's first \`{\`/\`[\`. */
  initStart: number
  /** Absolute char offset one past the initializer literal's closing \`}\`/\`]\`. */
  initEnd: number
}

/** A top-level \`const|let|var IDENT = <primitive>\` the user can override. */
export interface CodeParam {
  name: string
  /** JS type of the original literal. */
  type: 'number' | 'string' | 'boolean'
  /** The original source literal, e.g. \`42\`, \`"hi"\`, \`true\`. */
  original: string
  line: number
  /** Absolute offsets of the literal in the source. */
  literalStart: number
  literalEnd: number
}

/** An \`if (…)\` we let the user peek at. */
export interface Branch {
  /** Unique id (stable across parses of the same source). */
  id: string
  /** 1-indexed line of the \`if\`. */
  line: number
  /** The stringified condition, e.g. \`x > 10\`. */
  condition: string
}

export interface ParseResult {
  candidates: Candidate[]
  params: CodeParam[]
  branches: Branch[]
  error?: string
}

// ---------------------------------------------------------------------------
// Tracer output
// ---------------------------------------------------------------------------

/** Every meaningful thing that happens to the target during execution. */
export type EventKind =
  /** Initial creation of the target. */
  | 'create'
  /** A property or index was read. */
  | 'read'
  /** A property or index was written (or added). */
  | 'write'
  /** A property was \`delete\`'d. */
  | 'delete'
  /** A method was invoked on the target (arrays: push/pop/…; objects rare). */
  | 'method'
  /** The target was iterated over (spread, for-of, Object.keys, JSON.stringify…). */
  | 'iterate'
  /** A method call produced a new value the user probably cares about (map/filter/slice). */
  | 'derive'

export interface LifeEvent {
  id: string
  /** Ordinal, starting at 0. */
  step: number
  kind: EventKind
  /** Which entity this happened to: root name, or a derived entity's id. */
  entityId: string
  /** Property path within the entity, e.g. \`"0"\`, \`"user.name"\`, \`""\` for root. */
  path: string
  /** Human-readable one-liner, e.g. \`push({id:2})\`, \`read .name\`. */
  detail: string
  /** Snapshot of the relevant value (a shallow, JSON-safe clone). */
  value?: unknown
  /** Method arguments, JSON-safe. */
  args?: unknown[]
  /** Id of the derived entity produced by this event, when kind === 'derive'. */
  producedId?: string
}

/** A distinct object/array observed during the run (the target or a derivation). */
export interface Entity {
  id: string
  name: string
  kind: CandidateKind
  /** Undefined for the root. */
  parentId?: string
  /** Step at which this entity came into existence. */
  bornAtStep: number
  /** Final JSON-safe snapshot. */
  finalValue: unknown
}

export interface TraceResult {
  entities: Entity[]
  events: LifeEvent[]
  /** Which branches were entered at runtime. */
  branchesTaken: string[]
  /** console.log output, stringified. */
  logs: string[]
  /** Runtime error if the code threw. */
  error?: string
}

// ---------------------------------------------------------------------------
// Runtime knobs the UI passes back into the tracer
// ---------------------------------------------------------------------------

export interface TraceOptions {
  /** Target candidate name. */
  target: string
  /** Overrides for CodeParam values, keyed by param name. Each value is a JS literal source snippet. */
  paramOverrides?: Record<string, string>
  /** Hard cap on events captured, to keep runaway loops safe. */
  maxEvents?: number
  /** Hard cap on wall time, in ms. */
  timeBudgetMs?: number
}
`,"src/apps/sites/SitesApp.tsx":`import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import type { EditorView } from '@codemirror/view'
import { Console } from './components/Console'
import { Editor } from './components/Editor'
import { KeyBar } from './components/KeyBar'
import { Preview } from './components/Preview'
import { SiteList } from './components/SiteList'
import { FILES, type FileKind } from './files'
import { compose, download, isPreviewMessage, type LogEntry } from './compose'
import { useKeyboardInset } from './hooks/useKeyboardInset'
import * as store from './store'

/*
 * Sites — author a small static page and run it.
 *
 * The preview updates only when you press Run, never as you type. A Site can
 * run scripts, so re-rendering on every keystroke means \`while (true) {}\` hangs
 * the frame on every keystroke — and browsers do not reliably isolate a
 * sandboxed srcdoc iframe into its own process, so it can take the tab with it.
 */

export default function SitesApp() {
  const { sites, storage } = useSyncExternalStore(store.subscribe, store.getSnapshot)
  const [openId, setOpenId] = useState<string | null>(null)
  const [kind, setKind] = useState<FileKind>('html')
  const [pane, setPane] = useState<'edit' | 'preview'>('edit')
  const [doc, setDoc] = useState<string | null>(null)
  const [runKey, setRunKey] = useState(0)
  const [view, setView] = useState<EditorView | null>(null)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [consoleOpen, setConsoleOpen] = useState(false)
  const frameRef = useRef<HTMLIFrameElement | null>(null)
  const logId = useRef(0)

  const root = useRef<HTMLDivElement>(null)
  useKeyboardInset(root)

  useEffect(() => {
    void store.start()
    // The Shell unmounts an App on leave, so queued saves must be written out
    // rather than lost with the component.
    return () => store.flush()
  }, [])

  // Above the tablet breakpoint both panes are on screen and the Preview tab is
  // hidden, so "preview" stops being a meaningful mode. Without this, rotating
  // a tablet from portrait to landscape while previewing leaves no file tab
  // looking selected. 880px is the workbench's breakpoint convention.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 880px)')
    const sync = () => {
      if (mq.matches) setPane('edit')
    }
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  // A Site's console output arrives by postMessage from the sandboxed frame.
  // The frame's origin is the string "null", so identity comes from the source
  // window instead — see isPreviewMessage.
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (!isPreviewMessage(event, frameRef.current)) return
      const { level, text } = event.data
      setLogs((prev) => {
        const next = [...prev, { id: (logId.current += 1), level, text }]
        // A runaway loop can log thousands of lines; keep the tail.
        return next.length > 200 ? next.slice(-200) : next
      })
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  const site = openId ? sites.find((s) => s.id === openId) : undefined

  const run = useCallback(() => {
    if (!site) return
    setLogs([])
    setDoc(compose(site, { instrument: true }))
    setRunKey((k) => k + 1)
  }, [site])

  // Run once when a Site is opened, so the preview is never blank on arrival.
  const openedRef = useRef<string | null>(null)
  useEffect(() => {
    if (site && openedRef.current !== site.id) {
      openedRef.current = site.id
      setLogs([])
      setDoc(compose(site, { instrument: true }))
      setRunKey((k) => k + 1)
    }
    if (!site) openedRef.current = null
  }, [site])

  if (!site) {
    return (
      <div className="st-app" ref={root}>
        <SiteList
          sites={sites}
          storage={storage}
          onOpen={(id) => {
            setOpenId(id)
            setKind('html')
            setPane('edit')
          }}
          onCreate={() => {
            const created = store.create()
            setOpenId(created.id)
            setKind('html')
            setPane('edit')
          }}
          onRename={(id, name) => store.update(id, { name })}
          onDelete={(id) => store.remove(id)}
        />
      </div>
    )
  }

  return (
    <div className={\`st-app st-app--editing st-app--\${pane}\`} ref={root}>
      <header className="st-bar">
        <button
          type="button"
          className="st-bar__back"
          onClick={() => {
            store.flush()
            setOpenId(null)
          }}
          aria-label="All sites"
          data-tip="All sites"
        >
          ‹
        </button>
        <span className="st-bar__name">{site.name}</span>
        <button
          type="button"
          className="st-btn"
          onClick={() => download(site)}
          aria-label="Download this site"
          data-tip="Download as a single .html file"
          data-tip-align="end"
        >
          <span className="st-btn__icon" aria-hidden>
            ↓
          </span>
          <span className="st-btn__label">Download</span>
        </button>
        {/* Only where there is no Preview tab to press. Below the tablet
            breakpoint the Preview tab runs the Site itself, so a separate Run
            button would be a second control for one action. */}
        <button
          type="button"
          className="st-run"
          onClick={run}
          data-tip="Re-run this site"
          data-tip-align="end"
        >
          Run
        </button>
      </header>

      <nav className="st-tabs" role="tablist" aria-label="Files">
        {FILES.map((f) => (
          <button
            key={f.kind}
            type="button"
            role="tab"
            // On a phone the preview is a mode, so a file tab is only the
            // selected tab while the edit pane is the one on screen.
            aria-selected={kind === f.kind && pane === 'edit'}
            className={\`st-tab\${kind === f.kind && pane === 'edit' ? ' st-tab--on' : ''}\`}
            onClick={() => {
              setKind(f.kind)
              setPane('edit')
            }}
          >
            {f.label}
          </button>
        ))}
        {/* Phone only: the preview is a mode, not a pane. Below 880px there is
            not enough height to split once the keyboard is up. */}
        <button
          type="button"
          className={\`st-tab st-tab--preview\${pane === 'preview' ? ' st-tab--on' : ''}\`}
          // Runs every time, including when Preview is already showing, so it
          // doubles as the re-run control on phones.
          onClick={() => {
            run()
            setPane('preview')
          }}
        >
          Preview
        </button>
      </nav>

      <div className="st-panes">
        <div className="st-pane st-pane--edit">
          <Editor
            kind={kind}
            siteId={site.id}
            initialText={site[kind]}
            onChange={(text) => store.update(site.id, { [kind]: text })}
            onReady={setView}
          />
          <KeyBar view={view} />
        </div>
        <div className="st-pane st-pane--preview">
          <Preview
            doc={doc}
            runKey={runKey}
            frameRef={(el) => {
              frameRef.current = el
            }}
          />
          <Console
            entries={logs}
            open={consoleOpen}
            onToggle={() => setConsoleOpen((o) => !o)}
            onClear={() => setLogs([])}
          />
        </div>
      </div>
    </div>
  )
}
`,"src/apps/sites/components/Console.tsx":`import type { LogEntry } from '../compose'

/*
 * The Site's console output, surfaced in the app.
 *
 * A phone has no devtools, so without this a broken script just makes Run
 * appear to do nothing. Errors are the reason this exists, but console.log is
 * forwarded too — it is how people debug, and telling them to open a console
 * they do not have is no help.
 */

interface Props {
  entries: LogEntry[]
  open: boolean
  onToggle: () => void
  onClear: () => void
}

export function Console({ entries, open, onToggle, onClear }: Props) {
  if (entries.length === 0) return null
  const errors = entries.filter((e) => e.level === 'error').length

  return (
    <div className={\`st-console\${open ? ' st-console--open' : ''}\`}>
      <div className="st-console__bar">
        <button
          type="button"
          className="st-console__toggle"
          onClick={onToggle}
          aria-expanded={open}
        >
          <span className={\`st-console__chev\${open ? ' st-console__chev--open' : ''}\`}>›</span>
          Console
          <span className="st-console__count">{entries.length}</span>
          {errors > 0 && (
            <span className="st-console__errors">
              {errors} error{errors === 1 ? '' : 's'}
            </span>
          )}
        </button>
        {open && (
          <button type="button" className="st-console__clear" onClick={onClear}>
            Clear
          </button>
        )}
      </div>
      {open && (
        <ul className="st-console__lines">
          {entries.map((e) => (
            <li key={e.id} className={\`st-console__line st-console__line--\${e.level}\`}>
              {e.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
`,"src/apps/sites/components/Editor.tsx":`import { useEffect, useRef } from 'react'
import { EditorState, type Extension } from '@codemirror/state'
import { EditorView, highlightActiveLine, keymap, lineNumbers } from '@codemirror/view'
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands'
import {
  HighlightStyle,
  bracketMatching,
  indentOnInput,
  syntaxHighlighting,
} from '@codemirror/language'
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete'
import { javascript } from '@codemirror/lang-javascript'
import { css as cssLang } from '@codemirror/lang-css'
import { html as htmlLang } from '@codemirror/lang-html'
import { tags as t } from '@lezer/highlight'
import type { FileKind } from '../files'

/*
 * Sites' editing surface.
 *
 * Deliberately a separate copy from the IDE's rather than a shared module: Apps
 * import nothing from each other, and these two diverge on purpose — the IDE
 * reads a fixed repository snapshot, this one authors new content. CodeMirror
 * itself is not duplicated on the wire; Rollup hoists a dependency shared by
 * two lazy chunks into a common chunk.
 */

const highlight = HighlightStyle.define([
  { tag: [t.keyword, t.moduleKeyword], color: 'var(--st-kw)' },
  { tag: [t.string, t.special(t.string)], color: 'var(--st-str)' },
  { tag: [t.number, t.bool, t.null], color: 'var(--st-num)' },
  { tag: [t.comment, t.lineComment, t.blockComment], color: 'var(--st-cmt)', fontStyle: 'italic' },
  { tag: [t.typeName, t.className], color: 'var(--st-type)' },
  { tag: [t.function(t.variableName), t.function(t.propertyName)], color: 'var(--st-fn)' },
  { tag: [t.propertyName, t.attributeName], color: 'var(--st-prop)' },
  { tag: [t.tagName, t.angleBracket], color: 'var(--st-tag)' },
  { tag: [t.operator, t.punctuation, t.separator], color: 'var(--st-punc)' },
  { tag: [t.variableName, t.definition(t.variableName)], color: 'var(--st-text)' },
])

function languageFor(kind: FileKind): Extension[] {
  if (kind === 'html') return [htmlLang()]
  if (kind === 'css') return [cssLang()]
  return [javascript()]
}

const theme = EditorView.theme(
  {
    '&': { height: '100%', fontSize: 'var(--st-code-size)', color: 'var(--st-text)' },
    '.cm-scroller': {
      fontFamily: 'var(--st-mono)',
      lineHeight: '1.55',
      paddingBottom: '30vh',
    },
    '.cm-content': { caretColor: 'var(--st-accent)' },
    '.cm-gutters': {
      background: 'var(--st-panel)',
      color: 'var(--st-faint)',
      border: 'none',
      minWidth: '2.2em',
    },
    '.cm-activeLine': { background: 'var(--st-active)' },
    '.cm-activeLineGutter': { background: 'var(--st-active)', color: 'var(--st-dim)' },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection': {
      background: 'var(--st-selection)',
    },
    '.cm-cursor, .cm-dropCursor': { borderLeftColor: 'var(--st-accent)', borderLeftWidth: '2px' },
    '.cm-matchingBracket, &.cm-focused .cm-matchingBracket': { background: 'var(--st-match)' },
  },
  { dark: true },
)

interface Props {
  /** Remounts the document when the tab changes. */
  kind: FileKind
  /** Also part of the remount key: switching Site must not carry history over. */
  siteId: string
  initialText: string
  onChange: (text: string) => void
  onReady: (view: EditorView) => void
}

export function Editor({ kind, siteId, initialText, onChange, onReady }: Props) {
  const host = useRef<HTMLDivElement>(null)
  const changeRef = useRef(onChange)
  changeRef.current = onChange
  const readyRef = useRef(onReady)
  readyRef.current = onReady

  useEffect(() => {
    if (!host.current) return
    const view = new EditorView({
      state: EditorState.create({
        doc: initialText,
        extensions: [
          lineNumbers(),
          history(),
          highlightActiveLine(),
          bracketMatching(),
          closeBrackets(),
          indentOnInput(),
          syntaxHighlighting(highlight),
          EditorView.lineWrapping,
          keymap.of([...closeBracketsKeymap, ...defaultKeymap, ...historyKeymap, indentWithTab]),
          languageFor(kind),
          theme,
          EditorView.updateListener.of((u) => {
            if (u.docChanged) changeRef.current(u.state.doc.toString())
          }),
        ],
      }),
      parent: host.current,
    })
    readyRef.current(view)
    return () => view.destroy()
    // initialText is intentionally not a dependency: it is the seed for this
    // document, and re-running on every keystroke would destroy the editor.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind, siteId])

  return <div className="st-editor" ref={host} />
}
`,"src/apps/sites/components/KeyBar.tsx":`import type { EditorView } from '@codemirror/view'
import { indentMore, redo, undo } from '@codemirror/commands'

/*
 * Symbols phone keyboards bury, plus undo/redo since there is no Cmd+Z.
 * Weighted towards markup and CSS rather than the IDE's TypeScript-leaning set.
 */
const KEYS = ['<', '>', '/', '=', '"', "'", '{', '}', '(', ')', '[', ']', ';', ':', '-', '.', '#', '$', '\`', '!']

export function KeyBar({ view }: { view: EditorView | null }) {
  const act = (fn: () => void) => (e: React.PointerEvent) => {
    // pointerdown, not click: a click blurs the editor first and the phone
    // keyboard closes on every tap.
    e.preventDefault()
    if (!view) return
    fn()
    view.focus()
  }

  const insert = (text: string) => () => {
    if (!view) return
    const { from, to } = view.state.selection.main
    view.dispatch({
      changes: { from, to, insert: text },
      selection: { anchor: from + text.length },
      scrollIntoView: true,
    })
  }

  return (
    <div className="st-keybar" role="toolbar" aria-label="Symbols">
      <button type="button" className="st-key st-key--fn" aria-label="Undo" onPointerDown={act(() => view && undo(view))}>↶</button>
      <button type="button" className="st-key st-key--fn" aria-label="Redo" onPointerDown={act(() => view && redo(view))}>↷</button>
      <button type="button" className="st-key st-key--fn" aria-label="Indent" onPointerDown={act(() => view && indentMore(view))}>⇥</button>
      <span className="st-key__sep" />
      {KEYS.map((k) => (
        <button key={k} type="button" className="st-key" aria-label={\`Insert \${k}\`} onPointerDown={act(insert(k))}>
          {k}
        </button>
      ))}
    </div>
  )
}
`,"src/apps/sites/components/Preview.tsx":`/*
 * The Preview frame.
 *
 * \`sandbox\` without \`allow-same-origin\` is the load-bearing part: the frame
 * gets an opaque origin, so a Site's script cannot reach Find's localStorage or
 * IndexedDB. Find is a public site whose origin holds the Devices location
 * history and the IDE's edits — pasting someone else's HTML to "see what it
 * does" must not hand it any of that.
 *
 * The other flags are enabled because without them an ordinary page looks
 * broken for reasons the user cannot see: forms do nothing, target="_blank"
 * links are dead, alert() silently no-ops. None of them re-grants storage.
 * \`allow-top-navigation\` stays off — that is the flag that would let a Site
 * hijack the whole tab.
 */
const SANDBOX = 'allow-scripts allow-forms allow-popups allow-modals'

interface Props {
  /** Composed document, or null before the first Run. */
  doc: string | null
  /** Changes on every Run so the frame remounts and scripts re-execute. */
  runKey: number
  /** Lets the parent authenticate postMessages by source window. */
  frameRef: (el: HTMLIFrameElement | null) => void
}

export function Preview({ doc, runKey, frameRef }: Props) {
  if (doc === null) {
    return (
      <div className="st-preview st-preview--empty">
        <p>Press Run to see this site.</p>
      </div>
    )
  }
  return (
    <iframe
      key={runKey}
      ref={frameRef}
      className="st-preview"
      title="Site preview"
      sandbox={SANDBOX}
      srcDoc={doc}
    />
  )
}
`,"src/apps/sites/components/SiteList.tsx":`import { useState } from 'react'
import type { Site, StorageMode } from '../store'

/*
 * The Site list: everything you can do without opening a Site.
 *
 * Deletion gets a confirm that names the Site, because this is user-authored
 * content with no backup and no undo — "Are you sure?" is a prompt people tap
 * through reflexively, "Delete Untitled site?" is one they actually read.
 */

interface Props {
  sites: Site[]
  storage: StorageMode
  onOpen: (id: string) => void
  onCreate: () => void
  onRename: (id: string, name: string) => void
  onDelete: (id: string) => void
}

function when(ts: number): string {
  const mins = Math.round((Date.now() - ts) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return \`\${mins}m ago\`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return \`\${hrs}h ago\`
  return new Date(ts).toLocaleDateString()
}

export function SiteList({ sites, storage, onOpen, onCreate, onRename, onDelete }: Props) {
  const [confirming, setConfirming] = useState<Site | null>(null)
  const [renaming, setRenaming] = useState<Site | null>(null)
  const [draft, setDraft] = useState('')

  const startRename = (site: Site) => {
    setRenaming(site)
    setDraft(site.name)
  }

  const commitRename = () => {
    if (renaming) onRename(renaming.id, draft.trim() || 'Untitled site')
    setRenaming(null)
  }

  return (
    <div className="st-list">
      <header className="st-list__head">
        <h1 className="st-list__title">Sites</h1>
        <p className="st-list__sub">
          Write a small web page, run it, keep it on this device.
        </p>
      </header>

      {storage === 'memory' && (
        <p className="st-warn" role="alert">
          Your browser is blocking storage, so nothing here will be saved. Copy
          anything you want to keep, or download it before you leave.
        </p>
      )}

      <button type="button" className="st-new" onClick={onCreate}>
        + New site
      </button>

      {sites.length === 0 && storage !== 'loading' && (
        <p className="st-list__empty">
          No sites yet. Make one — it starts with a working page you can edit.
        </p>
      )}

      <ul className="st-cards">
        {sites.map((site) => (
          <li key={site.id} className="st-card">
            <button type="button" className="st-card__open" onClick={() => onOpen(site.id)}>
              <span className="st-card__name">{site.name}</span>
              <span className="st-card__meta">Edited {when(site.updatedAt)}</span>
            </button>
            <div className="st-card__actions">
              <button type="button" onClick={() => startRename(site)} aria-label={\`Rename \${site.name}\`}>
                Rename
              </button>
              <button
                type="button"
                className="st-card__danger"
                onClick={() => setConfirming(site)}
                aria-label={\`Delete \${site.name}\`}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {renaming && (
        <div className="st-modal" role="dialog" aria-label="Rename site">
          <div className="st-modal__panel">
            <h2>Rename site</h2>
            <input
              className="st-modal__input"
              value={draft}
              autoFocus
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitRename()
                if (e.key === 'Escape') setRenaming(null)
              }}
              aria-label="Site name"
            />
            <div className="st-modal__row">
              <button type="button" onClick={() => setRenaming(null)}>
                Cancel
              </button>
              <button type="button" className="st-modal__go" onClick={commitRename}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {confirming && (
        <div className="st-modal" role="dialog" aria-label="Confirm delete">
          <div className="st-modal__panel">
            <h2>Delete “{confirming.name}”?</h2>
            <p className="st-modal__note">
              This site is only on this device. Deleting it cannot be undone.
            </p>
            <div className="st-modal__row">
              <button type="button" onClick={() => setConfirming(null)}>
                Keep it
              </button>
              <button
                type="button"
                className="st-modal__danger"
                onClick={() => {
                  onDelete(confirming.id)
                  setConfirming(null)
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
`,"src/apps/sites/compose.ts":`import type { Site } from './store'

/*
 * Turning three files into one document.
 *
 * The hard case is that people paste. Someone drops a complete page —
 * \`<!doctype html><html>…</html>\` — into the markup field; someone else types
 * a bare \`<h1>Hello</h1>\`. Both have to work, and both need the stylesheet and
 * the script injected.
 *
 * DOMParser handles both without a special case: given a fragment it
 * constructs the missing html/head/body, and given a full document it keeps the
 * one that is there. String-splicing around \`</head>\` looks simpler right up
 * until someone omits the tag, at which point it silently does the wrong thing.
 *
 * Parsing here is safe: \`DOMParser\` with \`text/html\` neither executes scripts
 * nor fetches resources.
 */

/**
 * Forwards the Site's console output and uncaught errors to the parent.
 *
 * Without this a broken script fails silently: the error lands in the browser's
 * devtools console, which someone on a phone will never open, and pressing Run
 * appears to do nothing at all.
 *
 * Injected only for the Preview — \`download()\` composes without it, so the file
 * a user takes away is their own code and nothing else.
 *
 * No line numbers: the Site's script is an inline \`<script>\` in the composed
 * document, so the browser reports positions relative to that document rather
 * than to script.js. A wrong line number is worse than none.
 */
const CONSOLE_SHIM = \`(function () {
  var send = function (level, text) {
    try { parent.postMessage({ __findConsole: true, level: level, text: text }, '*') } catch (e) {}
  };
  var fmt = function (args) {
    return Array.prototype.map.call(args, function (a) {
      if (typeof a === 'string') return a;
      try { return JSON.stringify(a); } catch (e) { return String(a); }
    }).join(' ');
  };
  ['log', 'info', 'warn', 'error'].forEach(function (level) {
    var original = console[level];
    console[level] = function () {
      send(level, fmt(arguments));
      if (original) original.apply(console, arguments);
    };
  });
  window.addEventListener('error', function (e) { send('error', e.message); });
  window.addEventListener('unhandledrejection', function (e) {
    var r = e.reason;
    send('error', 'Unhandled promise rejection: ' + ((r && r.message) || String(r)));
  });
})();\`

export function compose(
  site: Pick<Site, 'html' | 'css' | 'js'>,
  { instrument = false }: { instrument?: boolean } = {},
): string {
  const doc = new DOMParser().parseFromString(site.html || '', 'text/html')

  if (instrument) {
    // First child of head, so it is installed before anything the Site does.
    const shim = doc.createElement('script')
    shim.textContent = CONSOLE_SHIM
    doc.head.prepend(shim)
  }

  if (site.css.trim()) {
    const style = doc.createElement('style')
    style.textContent = site.css
    doc.head.appendChild(style)
  }

  if (site.js.trim()) {
    const script = doc.createElement('script')
    // textContent, never innerHTML: the script is data here, not markup to
    // re-parse, and \`<\/script>\` inside a string must not terminate the element.
    script.textContent = site.js
    doc.body.appendChild(script)
  }

  // A pasted fragment has no charset or viewport; without them the preview
  // renders desktop-width on a phone and mangles non-ASCII text.
  if (!doc.querySelector('meta[charset]')) {
    const meta = doc.createElement('meta')
    meta.setAttribute('charset', 'utf-8')
    doc.head.prepend(meta)
  }
  if (!doc.querySelector('meta[name="viewport"]')) {
    const meta = doc.createElement('meta')
    meta.setAttribute('name', 'viewport')
    meta.setAttribute('content', 'width=device-width, initial-scale=1')
    doc.head.prepend(meta)
  }

  return '<!doctype html>\\n' + doc.documentElement.outerHTML
}

/** A filename-safe stem from a Site name, never empty. */
export function slug(name: string): string {
  const s = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
  return s || 'site'
}

/**
 * Hand the composed document to the user as one self-contained file.
 *
 * There is no backend, so this is the only way a Site leaves the device.
 */
export function download(site: Site): void {
  const url = URL.createObjectURL(new Blob([compose(site)], { type: 'text/html' }))
  const a = document.createElement('a')
  a.href = url
  a.download = \`\${slug(site.name)}.html\`
  a.click()
  URL.revokeObjectURL(url)
}

/** One console line forwarded from a running Preview. */
export interface LogEntry {
  id: number
  level: 'log' | 'info' | 'warn' | 'error'
  text: string
}

/**
 * True only for messages from a Preview frame we own.
 *
 * The frame has an opaque origin, so \`event.origin\` is the string "null" and is
 * worthless for authentication. Identity has to come from the source window.
 */
export function isPreviewMessage(
  event: MessageEvent,
  frame: HTMLIFrameElement | null,
): event is MessageEvent<{ __findConsole: true; level: LogEntry['level']; text: string }> {
  if (!frame || event.source !== frame.contentWindow) return false
  const data = event.data as { __findConsole?: unknown } | null
  return Boolean(data && typeof data === 'object' && data.__findConsole === true)
}
`,"src/apps/sites/files.ts":`import type { Site } from './store'

/**
 * A Site is exactly three files. Fixed, not arbitrary: a mini filesystem would
 * mean solving relative-path resolution inside a sandboxed preview, and a
 * single HTML file stops being enough the moment you want the CSS out of the
 * way.
 */
export type FileKind = 'html' | 'css' | 'js'

export const FILES: { kind: FileKind; label: string; filename: string }[] = [
  { kind: 'html', label: 'HTML', filename: 'index.html' },
  { kind: 'css', label: 'CSS', filename: 'style.css' },
  { kind: 'js', label: 'JS', filename: 'script.js' },
]

export const read = (site: Site, kind: FileKind): string => site[kind]
`,"src/apps/sites/hooks/useKeyboardInset.ts":`import { useEffect } from 'react'
import type { RefObject } from 'react'

/**
 * Keeps \`--st-kb\` equal to the height the on-screen keyboard is covering.
 *
 * The Shell hosts every App in a \`position: fixed\` container, and iOS does not
 * shrink the layout viewport when the keyboard opens — only \`visualViewport\`
 * reports what is actually visible. Without this the caret sits behind the
 * keyboard. (The IDE carries its own copy: Apps share no code by design.)
 */
export function useKeyboardInset(ref: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const vv = window.visualViewport
    const el = ref.current
    if (!vv || !el) return
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const hidden = window.innerHeight - vv.height - vv.offsetTop
        el.style.setProperty('--st-kb', hidden > 60 ? \`\${Math.round(hidden)}px\` : '0px')
      })
    }
    update()
    vv.addEventListener('resize', update)
    vv.addEventListener('scroll', update)
    return () => {
      cancelAnimationFrame(frame)
      vv.removeEventListener('resize', update)
      vv.removeEventListener('scroll', update)
      el.style.removeProperty('--st-kb')
    }
  }, [ref])
}
`,"src/apps/sites/index.tsx":`/*
 * Sites — App entry point. The Shell imports this lazily and renders the
 * default export.
 */
import './sites.css'
import SitesApp from './SitesApp'

export default SitesApp
`,"src/apps/sites/scaffold.ts":`/*
 * What a brand-new Site starts as.
 *
 * Not empty. Sites is reachable by anyone who opens the public URL, and a blank
 * editor next to a blank preview is the worst possible first screen for someone
 * who does not already know what the app is. This scaffold is deliberately
 * small enough to read in one screen, and every part of it visibly does
 * something the moment you press Run — so the relationship between the three
 * tabs and the output is obvious without explanation.
 */

export const SCAFFOLD = {
  html: \`<h1>Hello</h1>
<p>Edit the markup, styles and script, then press Run.</p>
<button id="go">Count me</button>
<p class="count">Clicks: <span id="n">0</span></p>
\`,
  css: \`body {
  margin: 0;
  padding: 2rem 1.25rem;
  font-family: system-ui, sans-serif;
  line-height: 1.5;
  color: #16202b;
  background: #f6f8fa;
}

h1 {
  margin: 0 0 0.25rem;
  font-size: 2rem;
  letter-spacing: -0.02em;
}

button {
  margin-top: 0.5rem;
  padding: 0.6rem 1.1rem;
  font: inherit;
  color: #fff;
  background: #2f6f4f;
  border: none;
  border-radius: 8px;
}

.count {
  color: #5a6b7b;
}
\`,
  js: \`let n = 0
document.getElementById('go').addEventListener('click', () => {
  n += 1
  document.getElementById('n').textContent = String(n)
})
\`,
}
`,"src/apps/sites/sites.css":`/*
 * Sites — app-owned styling. Every selector is prefixed \`st-\`, and the palette
 * is scoped to \`.st-app\` rather than \`:root\`, so nothing here reaches Devices,
 * Lifecycle or the IDE.
 */
.st-app {
  --st-bg: #10131a;
  --st-panel: #171c25;
  --st-panel-hi: #1f2734;
  --st-hairline: #28313e;
  --st-text: #e4e9f1;
  --st-dim: #8a97a8;
  --st-faint: #5b6675;
  --st-accent: #4ec9a6;
  --st-accent-press: #3bb391;
  --st-on-accent: #05201a;
  --st-danger: #ff7a8a;
  --st-warn-bg: rgba(240, 180, 41, 0.12);
  --st-warn-fg: #f0b429;
  --st-active: rgba(78, 201, 166, 0.07);
  --st-selection: rgba(78, 201, 166, 0.26);
  --st-match: rgba(78, 201, 166, 0.2);

  --st-kw: #c792ea;
  --st-str: #9fd67a;
  --st-num: #f2a765;
  --st-cmt: #5f6d7c;
  --st-type: #7fd1e0;
  --st-fn: #82aaff;
  --st-prop: #c3cede;
  --st-tag: #ff8a9b;
  --st-punc: #7f8c9b;

  --st-mono: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
  --st-code-size: 13px;
  --st-keybar-h: 42px;
  --st-kb: 0px;

  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: var(--st-text);
  background: var(--st-bg);
  padding-bottom: var(--st-kb);
}
.st-app :focus-visible {
  outline: 2px solid var(--st-accent);
  outline-offset: 1px;
}

/* ---------- Site list ---------- */
.st-list {
  flex: 1;
  overflow-y: auto;
  padding: calc(var(--safe-t) + 22px) calc(var(--safe-r) + 18px)
    calc(var(--safe-b) + 28px) calc(var(--safe-l) + 18px);
}
.st-list__head {
  max-width: 760px;
  margin: 0 auto 18px;
}
.st-list__title {
  font-size: 27px;
  font-weight: 700;
  letter-spacing: -0.025em;
}
.st-list__sub {
  margin-top: 4px;
  color: var(--st-faint);
  font-size: 14px;
}
.st-warn {
  max-width: 760px;
  margin: 0 auto 14px;
  padding: 11px 13px;
  border-radius: 10px;
  background: var(--st-warn-bg);
  border: 1px solid rgba(240, 180, 41, 0.3);
  color: var(--st-warn-fg);
  font-size: 13px;
  line-height: 1.45;
}
.st-new {
  display: block;
  width: 100%;
  max-width: 760px;
  margin: 0 auto 16px;
  height: 50px;
  border-radius: 12px;
  background: var(--st-accent);
  color: var(--st-on-accent);
  font-size: 16px;
  font-weight: 650;
}
.st-new:active {
  background: var(--st-accent-press);
}
.st-list__empty {
  max-width: 760px;
  margin: 0 auto;
  padding: 18px 2px;
  color: var(--st-faint);
  font-size: 14px;
  line-height: 1.5;
}
.st-cards {
  max-width: 760px;
  margin: 0 auto;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.st-card {
  border-radius: 12px;
  background: var(--st-panel);
  border: 1px solid var(--st-hairline);
  overflow: hidden;
}
.st-card__open {
  display: block;
  width: 100%;
  padding: 14px 15px 12px;
  text-align: left;
}
.st-card__name {
  display: block;
  font-size: 16px;
  font-weight: 600;
}
.st-card__meta {
  display: block;
  margin-top: 3px;
  font-size: 12.5px;
  color: var(--st-faint);
}
.st-card__actions {
  display: flex;
  gap: 2px;
  border-top: 1px solid var(--st-hairline);
}
.st-card__actions button {
  flex: 1;
  min-height: 42px;
  font-size: 13.5px;
  color: var(--st-dim);
}
.st-card__actions button:active {
  background: var(--st-panel-hi);
  color: var(--st-text);
}
.st-card__danger {
  color: var(--st-danger) !important;
}

/* ---------- Modals ---------- */
.st-modal {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  padding: 22px;
  background: rgba(6, 9, 13, 0.62);
}
.st-modal__panel {
  width: min(400px, 100%);
  padding: 20px;
  border-radius: 14px;
  background: var(--st-panel-hi);
  border: 1px solid var(--st-hairline);
}
.st-modal__panel h2 {
  font-size: 17px;
  font-weight: 650;
  line-height: 1.35;
}
.st-modal__note {
  margin-top: 8px;
  font-size: 13.5px;
  line-height: 1.45;
  color: var(--st-dim);
}
.st-modal__input {
  width: 100%;
  height: 44px;
  margin-top: 14px;
  padding: 0 12px;
  border-radius: 9px;
  background: var(--st-bg);
  border: 1px solid var(--st-hairline);
  outline: none;
  font-size: 16px;
  color: var(--st-text);
}
.st-modal__row {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}
.st-modal__row button {
  flex: 1;
  min-height: 44px;
  border-radius: 10px;
  background: var(--st-panel);
  border: 1px solid var(--st-hairline);
  color: var(--st-text);
  font-size: 15px;
  font-weight: 550;
}
.st-modal__go {
  background: var(--st-accent) !important;
  border-color: var(--st-accent) !important;
  color: var(--st-on-accent) !important;
}
.st-modal__danger {
  background: var(--st-danger) !important;
  border-color: var(--st-danger) !important;
  color: #2a0a10 !important;
}

/* ---------- Editor chrome ---------- */
.st-bar {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 6px;
  height: 44px;
  padding: 0 calc(var(--safe-r) + 8px) 0 calc(var(--safe-l) + 4px);
  background: var(--st-panel);
  border-bottom: 1px solid var(--st-hairline);
}
.st-bar__back {
  flex: 0 0 auto;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  color: var(--st-dim);
  font-size: 24px;
  line-height: 1;
}
.st-bar__name {
  flex: 1;
  min-width: 0;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
/* Secondary button: bordered and labelled rather than a bare glyph. */
.st-btn {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 12px;
  border-radius: 8px;
  background: var(--st-panel-hi);
  border: 1px solid var(--st-hairline);
  color: var(--st-text);
  font-size: 13.5px;
  font-weight: 550;
}
.st-btn:active {
  background: var(--st-hairline);
}
.st-btn__icon {
  font-size: 15px;
  line-height: 1;
}

.st-run {
  flex: 0 0 auto;
  height: 32px;
  padding: 0 16px;
  border-radius: 8px;
  background: var(--st-accent);
  color: var(--st-on-accent);
  font-size: 14px;
  font-weight: 650;
}
.st-run:active {
  background: var(--st-accent-press);
}

/* Below the tablet breakpoint the Preview tab runs the Site, so a separate Run
   button would be a second control for the same action competing for the
   narrowest bar. The Download label goes too — the icon carries it there. */
@media (max-width: 879px) {
  .st-run {
    display: none;
  }
  .st-btn__label {
    display: none;
  }
  .st-btn {
    padding: 0 9px;
  }
}

/* ---------- Tooltips ---------- */
/* Hover-only by design: a tooltip that fires on touch just sticks to the screen
   after a tap. \`@media (hover: hover)\` keeps them off phones entirely, where
   every control is either labelled or has an aria-label anyway. */
@media (hover: hover) {
  .st-app [data-tip] {
    position: relative;
  }
  .st-app [data-tip]::after {
    content: attr(data-tip);
    position: absolute;
    z-index: 70;
    top: calc(100% + 7px);
    left: 50%;
    transform: translateX(-50%);
    padding: 5px 9px;
    border-radius: 7px;
    background: var(--st-panel-hi);
    border: 1px solid var(--st-hairline);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.45);
    color: var(--st-text);
    font-family: inherit;
    font-size: 11.5px;
    font-weight: 500;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    /* Delayed in, instant out: no flicker when crossing a row of buttons. */
    transition: opacity 110ms ease 380ms;
  }
  /* Right-edge controls would otherwise be clipped by the app's overflow. */
  .st-app [data-tip][data-tip-align='end']::after {
    left: auto;
    right: 0;
    transform: none;
  }
  .st-app [data-tip]:hover::after,
  .st-app [data-tip]:focus-visible::after {
    opacity: 1;
  }
}

.st-tabs {
  flex: 0 0 auto;
  display: flex;
  gap: 2px;
  padding: 0 calc(var(--safe-r) + 8px) 0 calc(var(--safe-l) + 8px);
  background: var(--st-panel);
  border-bottom: 1px solid var(--st-hairline);
}
.st-tab {
  flex: 1;
  min-height: 38px;
  font-family: var(--st-mono);
  font-size: 12.5px;
  color: var(--st-faint);
  border-bottom: 2px solid transparent;
}
.st-tab--on {
  color: var(--st-text);
  border-bottom-color: var(--st-accent);
}

/* ---------- Panes ---------- */
.st-panes {
  flex: 1;
  min-height: 0;
  display: flex;
}
.st-pane {
  position: relative;
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.st-editor {
  flex: 1;
  min-height: 0;
  position: relative;
  overflow: hidden;
}
.st-preview {
  flex: 1;
  width: 100%;
  border: none;
  background: #fff;
}
.st-preview--empty {
  display: grid;
  place-items: center;
  background: var(--st-bg);
  color: var(--st-faint);
  font-size: 14px;
}

/* Phone: one pane at a time. */
.st-app--edit .st-pane--preview,
.st-app--preview .st-pane--edit {
  display: none;
}

/* ---------- Console ---------- */
/* A phone has no devtools, so a Site's errors have to surface here. Collapsed
   to a single bar until opened, so it never steals preview height unasked. */
.st-console {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  min-height: 0;
  background: var(--st-panel);
  border-top: 1px solid var(--st-hairline);
}
.st-console--open {
  /* Never more than half the pane: the preview is still the point. */
  max-height: 50%;
}
.st-console__bar {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  height: 34px;
  padding-right: calc(var(--safe-r) + 8px);
}
.st-console__toggle {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 7px;
  height: 100%;
  padding-left: calc(var(--safe-l) + 10px);
  font-size: 12.5px;
  font-weight: 600;
  color: var(--st-dim);
}
.st-console__chev {
  display: inline-block;
  transition: transform 140ms;
  font-size: 15px;
  line-height: 1;
}
.st-console__chev--open {
  transform: rotate(90deg);
}
.st-console__count {
  min-width: 18px;
  height: 17px;
  padding: 0 5px;
  border-radius: 999px;
  background: var(--st-panel-hi);
  color: var(--st-dim);
  font-size: 11px;
  font-weight: 600;
  display: grid;
  place-items: center;
}
.st-console__errors {
  color: var(--st-danger);
  font-weight: 600;
}
.st-console__clear {
  flex: 0 0 auto;
  padding: 0 8px;
  font-size: 12.5px;
  color: var(--st-faint);
}
.st-console__lines {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  list-style: none;
  padding-bottom: calc(var(--safe-b) + 6px);
}
.st-console__line {
  padding: 6px 12px 6px calc(var(--safe-l) + 12px);
  border-top: 1px solid var(--st-hairline);
  font-family: var(--st-mono);
  font-size: 12px;
  line-height: 1.45;
  color: var(--st-dim);
  white-space: pre-wrap;
  word-break: break-word;
}
.st-console__line--error {
  color: var(--st-danger);
  background: rgba(255, 122, 138, 0.07);
}
.st-console__line--warn {
  color: var(--st-warn-fg);
}

/* ---------- Symbol row ---------- */
.st-keybar {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 4px;
  height: var(--st-keybar-h);
  padding: 0 calc(var(--safe-r) + 6px) 0 calc(var(--safe-l) + 6px);
  background: var(--st-panel);
  border-top: 1px solid var(--st-hairline);
  overflow-x: auto;
  scrollbar-width: none;
  overscroll-behavior-x: contain;
}
.st-keybar::-webkit-scrollbar {
  display: none;
}
.st-key {
  flex: 0 0 auto;
  min-width: 32px;
  height: 30px;
  padding: 0 6px;
  border-radius: 7px;
  display: grid;
  place-items: center;
  background: var(--st-panel-hi);
  border: 1px solid var(--st-hairline);
  color: var(--st-text);
  font-family: var(--st-mono);
  font-size: 14px;
  line-height: 1;
}
.st-key--fn {
  color: var(--st-accent);
}
.st-key:active {
  background: var(--st-accent);
  color: var(--st-on-accent);
}
.st-key__sep {
  flex: 0 0 auto;
  width: 1px;
  height: 18px;
  margin: 0 3px;
  background: var(--st-hairline);
}

/* ---------- Tablet: editor and preview side by side ---------- */
@media (min-width: 880px) {
  .st-app--editing .st-pane--edit,
  .st-app--editing .st-pane--preview {
    display: flex;
  }
  .st-pane--preview {
    border-left: 1px solid var(--st-hairline);
  }
  .st-tab--preview {
    display: none;
  }
  .st-app {
    --st-code-size: 13.5px;
  }
}
`,"src/apps/sites/store.ts":`import { SCAFFOLD } from './scaffold'

/*
 * Sites are user-authored content with no backup and no undo, so they live in
 * IndexedDB rather than localStorage. Two reasons: localStorage's ~5MB is shared
 * with every other App on this origin — a large Site could break Devices — and
 * IndexedDB is the right store for documents someone would be upset to lose.
 *
 * When IndexedDB is unavailable (Safari private browsing, locked-down
 * profiles), the store runs in memory and reports \`storage: 'memory'\` so the UI
 * can warn *before* the user has typed 500 lines. It deliberately does not fall
 * back to localStorage: that would undo the isolation above.
 */

export interface Site {
  id: string
  name: string
  html: string
  css: string
  js: string
  createdAt: number
  updatedAt: number
}

export type StorageMode = 'loading' | 'indexeddb' | 'memory'

export interface State {
  sites: Site[]
  storage: StorageMode
}

const DB_NAME = 'find.sites'
const DB_VERSION = 1
const STORE = 'sites'
/** Long enough to batch a burst of typing, short enough to survive a fast exit. */
const SAVE_DEBOUNCE_MS = 400

type Listener = () => void

let state: State = { sites: [], storage: 'loading' }
const listeners = new Set<Listener>()
let db: IDBDatabase | null = null
const pending = new Map<string, ReturnType<typeof setTimeout>>()

function emit(): void {
  state = { ...state }
  for (const l of listeners) l()
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getSnapshot(): State {
  return state
}

function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return \`s_\${Date.now().toString(36)}_\${Math.random().toString(36).slice(2, 8)}\`
}

function openDb(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    let settled = false
    const done = (value: IDBDatabase | null) => {
      if (settled) return
      settled = true
      resolve(value)
    }
    try {
      if (typeof indexedDB === 'undefined') return done(null)
      const req = indexedDB.open(DB_NAME, DB_VERSION)
      req.onupgradeneeded = () => {
        if (!req.result.objectStoreNames.contains(STORE)) {
          req.result.createObjectStore(STORE, { keyPath: 'id' })
        }
      }
      req.onsuccess = () => done(req.result)
      req.onerror = () => done(null)
      req.onblocked = () => done(null)
      // Safari private browsing can leave the request hanging rather than
      // erroring; don't let the app sit on a spinner forever.
      setTimeout(() => done(null), 3000)
    } catch {
      done(null)
    }
  })
}

/** Hydrate from IndexedDB. Safe to call more than once; only the first runs. */
let started = false
export async function start(): Promise<void> {
  if (started) return
  started = true
  db = await openDb()
  if (!db) {
    state = { sites: state.sites, storage: 'memory' }
    emit()
    return
  }
  const sites = await new Promise<Site[]>((resolve) => {
    try {
      const req = db!.transaction(STORE, 'readonly').objectStore(STORE).getAll()
      req.onsuccess = () => resolve((req.result as Site[]) ?? [])
      req.onerror = () => resolve([])
    } catch {
      resolve([])
    }
  })
  sites.sort((a, b) => b.updatedAt - a.updatedAt)
  state = { sites, storage: 'indexeddb' }
  emit()
}

function put(site: Site): void {
  if (!db) return
  try {
    db.transaction(STORE, 'readwrite').objectStore(STORE).put(site)
  } catch {
    // A failed write must not lose what is already in memory; the user keeps
    // working and the warning banner already explains storage is unreliable.
  }
}

function queueSave(site: Site): void {
  const existing = pending.get(site.id)
  if (existing) clearTimeout(existing)
  pending.set(
    site.id,
    setTimeout(() => {
      pending.delete(site.id)
      const current = state.sites.find((s) => s.id === site.id)
      if (current) put(current)
    }, SAVE_DEBOUNCE_MS),
  )
}

/** Write any queued saves immediately — the Shell unmounts Apps on leave. */
export function flush(): void {
  for (const [id, timer] of pending) {
    clearTimeout(timer)
    const current = state.sites.find((s) => s.id === id)
    if (current) put(current)
  }
  pending.clear()
}

export function create(): Site {
  const now = Date.now()
  const site: Site = {
    id: newId(),
    name: 'Untitled site',
    ...SCAFFOLD,
    createdAt: now,
    updatedAt: now,
  }
  state = { ...state, sites: [site, ...state.sites] }
  put(site)
  emit()
  return site
}

export function get(id: string): Site | undefined {
  return state.sites.find((s) => s.id === id)
}

type Editable = Pick<Site, 'name' | 'html' | 'css' | 'js'>

export function update(id: string, patch: Partial<Editable>): void {
  const site = state.sites.find((s) => s.id === id)
  if (!site) return
  const next: Site = { ...site, ...patch, updatedAt: Date.now() }
  state = { ...state, sites: state.sites.map((s) => (s.id === id ? next : s)) }
  queueSave(next)
  emit()
}

export function remove(id: string): void {
  const timer = pending.get(id)
  if (timer) {
    clearTimeout(timer)
    pending.delete(id)
  }
  state = { ...state, sites: state.sites.filter((s) => s.id !== id) }
  if (db) {
    try {
      db.transaction(STORE, 'readwrite').objectStore(STORE).delete(id)
    } catch {
      // Removed from view regardless; a stale row would be filtered on reload.
    }
  }
  emit()
}
`,"src/main.tsx":`import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './shell/tokens.css'
import './shell/reset.css'
import './shell/shell.css'
import Shell from './shell/Shell.tsx'

registerSW({ immediate: true })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Shell />
  </StrictMode>,
)
`,"src/shell/Home.tsx":`import { registry } from './registry'
import { navigate } from './router'

/**
 * Home — the App picker. A tile per Registry entry, tinted with that App's
 * accent so the grid previews each App's identity rather than flattening them.
 */
export default function Home() {
  return (
    <div className="shell-home">
      <header className="shell-home__head">
        <h1 className="shell-home__title">Find</h1>
        <p className="shell-home__tagline">
          {registry.length} {registry.length === 1 ? 'app' : 'apps'} on this
          workbench
        </p>
      </header>

      <div className="shell-grid">
        {registry.map((app) => (
          <button
            key={app.id}
            type="button"
            className="shell-tile"
            style={{ '--tile-accent': app.accent } as React.CSSProperties}
            onClick={() => navigate(app.id)}
          >
            <span className="shell-tile__icon">
              <app.icon />
            </span>
            <span className="shell-tile__name">{app.name}</span>
            <span className="shell-tile__desc">{app.description}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
`,"src/shell/Shell.tsx":`import { Suspense, lazy, useMemo } from 'react'
import Home from './Home'
import { findApp } from './registry'
import { goHome, useRoute } from './router'
import type { LoadedApp } from './types'

/*
 * The Shell — owns the window, the route, and the bar. It renders exactly one
 * App at a time and unmounts it on leave, so an App can never keep a sensor or
 * a timer running behind another App's UI.
 */

/** React.lazy wrappers, created once per App id and reused across renders. */
const lazyCache = new Map<string, LoadedApp>()

function resolve(id: string): LoadedApp | undefined {
  const cached = lazyCache.get(id)
  if (cached) return cached
  const entry = findApp(id)
  if (!entry) return undefined
  const loaded: LoadedApp = { ...entry, Component: lazy(entry.load) }
  lazyCache.set(id, loaded)
  return loaded
}

export default function Shell() {
  const route = useRoute()
  const app = useMemo(() => (route ? resolve(route) : undefined), [route])

  // Unknown id falls back to Home rather than a dead end.
  if (!app) return <Home />

  return (
    <>
      <div className="shell-bar">
        <button
          type="button"
          className="shell-bar__back"
          onClick={goHome}
          aria-label="Back to Find"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          <span>Find</span>
        </button>
        <span className="shell-bar__title">{app.name}</span>
      </div>

      {/* isolation: isolate confines the App's z-indexes to this container, so
          no App can paint over the Shell bar however high it stacks. */}
      <main className="shell-host" key={app.id}>
        <Suspense fallback={<div className="shell-loading">Loading…</div>}>
          <app.Component />
        </Suspense>
      </main>
    </>
  )
}
`,"src/shell/registry.ts":`import { createElement as h } from 'react'
import type { AppEntry } from './types'

/*
 * The Registry — the single list of Apps.
 *
 * Adding an App means adding one entry here and creating its folder under
 * src/apps/<id>/. Nothing else in the Shell changes. See AGENTS.md.
 *
 * Icons are declared here rather than imported from the App so that adding an
 * App to Home never pulls that App's code into the initial bundle.
 */

const svg = (...children: string[]) =>
  h(
    'svg',
    {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 1.75,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      'aria-hidden': true,
    },
    children.map((d, i) => h('path', { key: i, d })),
  )

const DevicesIcon = () =>
  svg(
    'M12 21s7-5.686 7-11a7 7 0 1 0-14 0c0 5.314 7 11 7 11Z',
    'M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  )

const IdeIcon = () =>
  svg(
    'M9.5 8.5 6 12l3.5 3.5',
    'M14.5 8.5 18 12l-3.5 3.5',
    'M4 5.5h16v13H4z',
  )

const LifecycleIcon = () =>
  svg(
    'M4 6h6M4 12h3M4 18h8',
    'M15 4v6M15 4l-2.5 2.5M15 4l2.5 2.5',
    'M19 20a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  )

const SitesIcon = () =>
  svg(
    'M4 5.5h16v13H4z',
    'M4 9.5h16',
    'M6.5 7.5h.01M9 7.5h.01',
  )

export const registry: AppEntry[] = [
  {
    id: 'devices',
    name: 'Devices',
    description: 'Locate your things on a live map',
    icon: DevicesIcon,
    accent: '#ffb02e',
    load: () => import('../apps/devices'),
  },
  {
    id: 'lifecycle',
    name: 'Lifecycle',
    description: 'Trace every read and write on an object',
    icon: LifecycleIcon,
    accent: '#7dd3fc',
    load: () => import('../apps/lifecycle'),
  },
  {
    id: 'ide',
    name: 'IDE',
    description: 'Read and edit this project from your phone',
    icon: IdeIcon,
    accent: '#8b7cf6',
    load: () => import('../apps/ide'),
  },
  {
    id: 'sites',
    name: 'Sites',
    description: 'Build and preview a small web page',
    icon: SitesIcon,
    accent: '#4ec9a6',
    load: () => import('../apps/sites'),
  },
]

export const findApp = (id: string): AppEntry | undefined =>
  registry.find((a) => a.id === id)
`,"src/shell/reset.css":`/*
 * A true reset, and nothing else.
 *
 * Opinions belonging to one App — text selection, overscroll, colour — live in
 * that App's own stylesheet, scoped to its root class. Nothing here may assume
 * anything about what an App looks like.
 */
*,
*::before,
*::after {
  box-sizing: border-box;
}
* {
  margin: 0;
  -webkit-tap-highlight-color: transparent;
}
html,
body,
#root {
  height: 100%;
}
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, Roboto,
    Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
button {
  font: inherit;
  color: inherit;
  border: none;
  background: none;
  cursor: pointer;
}
input {
  font: inherit;
  color: inherit;
}

/* Accessibility baselines every App inherits. An App may override the focus
   ring with a more specific selector on its own root. */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
  border-radius: 6px;
}
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.001ms !important;
  }
}
`,"src/shell/router.ts":`import { useSyncExternalStore } from 'react'

/*
 * Hash routing, hand-rolled.
 *
 * Hash rather than the History API because Find is served from GitHub Pages,
 * which has no rewrite rules: \`/find/lifecycle\` would 404 on refresh and on PWA
 * cold-start. Routes are flat — the Shell owns \`#/<appId>\` and an App owns
 * nothing below it.
 */

/** The App id in the URL, or '' for Home. */
function read(): string {
  const raw = window.location.hash.replace(/^#\\/?/, '')
  return raw.split(/[/?]/)[0] ?? ''
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}

export function useRoute(): string {
  return useSyncExternalStore(subscribe, read, () => '')
}

export function navigate(id: string): void {
  window.location.hash = id ? \`/\${id}\` : '/'
}

export function goHome(): void {
  navigate('')
}
`,"src/shell/shell.css":`/*
 * Shell chrome — the bar, Home, and the App host.
 *
 * Neutral graphite on purpose: each App brings its own accent, and Home tints
 * each tile with it. Everything here is prefixed \`shell-\` so it can never
 * collide with an App's class names.
 */
:root {
  --shell-ground: #0c0e11;
  --shell-surface: #14181d;
  --shell-surface-hi: #1b2129;
  --shell-hairline: #232a32;
  --shell-text: #e8edf2;
  --shell-text-dim: #8892a0;
  --shell-text-faint: #5b6673;
  --shell-bar-h: 44px;
}

html {
  background: var(--shell-ground);
}
body {
  color: var(--shell-text);
  background: var(--shell-ground);
  letter-spacing: -0.01em;
}

/* ---------- Bar ---------- */
.shell-bar {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  right: 0;
  height: calc(var(--shell-bar-h) + var(--safe-t));
  padding: var(--safe-t) calc(var(--safe-r) + 8px) 0 calc(var(--safe-l) + 8px);
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(12, 14, 17, 0.88);
  border-bottom: 1px solid var(--shell-hairline);
  backdrop-filter: blur(16px) saturate(1.2);
}
.shell-bar__back {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  height: 34px;
  padding: 0 10px 0 4px;
  border-radius: 999px;
  color: var(--shell-text-dim);
  font-size: 14px;
  font-weight: 550;
  transition: background 120ms, color 120ms;
}
.shell-bar__back:active {
  background: var(--shell-surface-hi);
  color: var(--shell-text);
}
.shell-bar__back svg {
  width: 20px;
  height: 20px;
}
.shell-bar__title {
  font-size: 14px;
  font-weight: 600;
  color: var(--shell-text);
}

/* ---------- App host ---------- */
.shell-host {
  position: fixed;
  inset: calc(var(--shell-bar-h) + var(--safe-t)) 0 0 0;
  overflow: hidden;
  /* Load-bearing. \`contain\` makes this a containing block for position:fixed
     descendants, so an App that pins itself to \`inset: 0\` — both current Apps
     do — fills the host rather than escaping to the viewport and sliding under
     the bar. It also establishes a stacking context, so no App can out-z-index
     the Shell however high it stacks. An App needs to know none of this. */
  contain: layout paint;
}
.shell-loading {
  display: grid;
  place-items: center;
  height: 100%;
  color: var(--shell-text-faint);
  font-size: 14px;
}

/* ---------- Home ---------- */
.shell-home {
  height: 100%;
  overflow-y: auto;
  padding: calc(var(--safe-t) + 28px) calc(var(--safe-r) + 20px)
    calc(var(--safe-b) + 32px) calc(var(--safe-l) + 20px);
}
.shell-home__head {
  max-width: 900px;
  margin: 0 auto 26px;
}
.shell-home__title {
  font-size: 30px;
  font-weight: 700;
  letter-spacing: -0.03em;
}
.shell-home__tagline {
  margin-top: 5px;
  color: var(--shell-text-faint);
  font-size: 14px;
}
.shell-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 200px), 1fr));
  gap: 12px;
  max-width: 900px;
  margin: 0 auto;
}
.shell-tile {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  min-height: 132px;
  padding: 16px;
  border-radius: 16px;
  text-align: left;
  background: var(--shell-surface);
  border: 1px solid var(--shell-hairline);
  transition: transform 120ms, border-color 120ms, background 120ms;
}
.shell-tile:active {
  transform: scale(0.975);
  background: var(--shell-surface-hi);
}
@media (hover: hover) {
  .shell-tile:hover {
    border-color: color-mix(in srgb, var(--tile-accent) 45%, transparent);
  }
}
.shell-tile__icon {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  margin-bottom: 12px;
  border-radius: 12px;
  color: var(--tile-accent);
  background: color-mix(in srgb, var(--tile-accent) 14%, transparent);
  border: 1px solid color-mix(in srgb, var(--tile-accent) 28%, transparent);
}
.shell-tile__icon svg {
  width: 22px;
  height: 22px;
}
.shell-tile__name {
  font-size: 16px;
  font-weight: 650;
  color: var(--shell-text);
}
.shell-tile__desc {
  font-size: 13px;
  line-height: 1.35;
  color: var(--shell-text-faint);
}
`,"src/shell/tokens.css":`/*
 * Device tokens — facts about the machine, not about taste.
 *
 * The Shell owns these and every App inherits them. Anything aesthetic
 * (colour, type scale, radii, shadows, motion) belongs to the App, scoped to
 * the App's own root class. See CONTEXT.md.
 */
:root {
  /* Populated by viewport-fit=cover; 0px everywhere else. */
  --safe-t: env(safe-area-inset-top, 0px);
  --safe-b: env(safe-area-inset-bottom, 0px);
  --safe-l: env(safe-area-inset-left, 0px);
  --safe-r: env(safe-area-inset-right, 0px);
}
`,"src/shell/types.ts":`import type { ComponentType, LazyExoticComponent } from 'react'

/**
 * Everything the Shell knows about an App.
 *
 * Deliberately minimal: the Shell gives an App a container and nothing else —
 * no storage, no toast, no navigation handle. Add a field here only once a real
 * App cannot work without it. See AGENTS.md.
 */
export interface AppEntry {
  /** URL segment and React key. Lowercase, no spaces: \`#/devices\`. */
  id: string
  /** Shown on the Home tile and in the Shell bar. */
  name: string
  /** One line, shown under the name on the Home tile. */
  description: string
  /** Inline SVG component. Defined in the Registry so it stays out of the
   *  App's lazily-loaded chunk. */
  icon: ComponentType
  /** Any CSS colour. Tints this App's Home tile so Home previews its identity. */
  accent: string
  /** Dynamic import of the App's entry module, whose default export is the
   *  App's root component. Lazy so one App's dependencies never load for
   *  another. */
  load: () => Promise<{ default: ComponentType }>
}

/** Internal: an AppEntry with its memoised React.lazy wrapper. */
export type LoadedApp = AppEntry & {
  Component: LazyExoticComponent<ComponentType>
}
`,"src/vite-env.d.ts":`/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

declare module 'virtual:project-snapshot' {
  /** Repository source captured at build time, keyed by repo-relative path. */
  export const files: Record<string, string>
  /** ISO timestamp of when the snapshot was taken. */
  export const capturedAt: string
}
`,"tsconfig.app.json":`{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "es2023",
    "lib": ["ES2023", "DOM"],
    "module": "esnext",
    "types": ["vite/client"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  /* Node-side build plugin; type-checked by tsconfig.node.json instead. */
  "exclude": ["src/apps/ide/snapshot.plugin.ts"]
}
`,"tsconfig.json":`{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
`,"tsconfig.node.json":`{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "es2023",
    "lib": ["ES2023"],
    "types": ["node"],
    "skipLibCheck": true,

    /* Bundler mode */
    "module": "nodenext",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["vite.config.ts", "src/apps/ide/snapshot.plugin.ts"]
}
`,"vite.config.ts":`import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
// App-specific build-time plugin, kept in the App's own folder. See AGENTS.md.
import { projectSnapshot } from './src/apps/ide/snapshot.plugin.ts'

// Served from a GitHub Pages project site (https://<user>.github.io/find/),
// so production assets live under /find/. Local dev stays at the root.
// Override with BASE_PATH at build time for a custom domain or user site.
const BASE = process.env.BASE_PATH ?? '/find/'

// https://vite.dev/config/
export default defineConfig(({ command, isPreview }) => {
  // \`preview\` serves the production build, so it needs the production base too
  // — otherwise the built HTML asks for /find/assets/* and gets 404s.
  const base = command === 'build' || isPreview ? BASE : '/'
  return {
  base,
  plugins: [
    react(),
    projectSnapshot(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Find — Workbench',
        short_name: 'Find',
        description: 'A personal workbench of small, self-contained apps.',
        theme_color: '#0c0e11',
        background_color: '#0c0e11',
        display: 'standalone',
        orientation: 'any',
        start_url: base,
        scope: base,
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Precache the Shell only — index.html, the Shell's own chunk, the
        // manifest and the icons. App chunks are deliberately absent: each App
        // is cached the first time it is opened (see runtimeCaching below), so
        // installing Find does not drag down every App's dependencies. The
        // trade is that an App you have never opened will not work offline.
        //
        // These patterns are deliberately an allow-list rather than a list of
        // App chunks to ignore, so adding an App needs no change here.
        globPatterns: [
          'index.html',
          'manifest.webmanifest',
          'assets/index-*.{js,css}',
          '*.{png,svg,ico}',
        ],
        // App-specific build-time config. Workbox rules cannot live inside an
        // App's folder, so this is the documented exception to the
        // one-folder-plus-one-Registry-entry rule. See AGENTS.md.
        runtimeCaching: [
          {
            // App chunks are content-hashed and therefore immutable: cache the
            // first time an App is opened, then serve offline forever.
            urlPattern: /\\/assets\\/[^/]+\\.(?:js|css)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'app-chunks',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 90 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Devices: cache OpenStreetMap tiles so the map works offline.
            urlPattern: /^https:\\/\\/[abc]\\.tile\\.openstreetmap\\.org\\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'osm-tiles',
              expiration: { maxEntries: 1000, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  }
})
`},jt=`2026-09-15T05:40:30.275Z`,Mt=`find.ide.edits.v1`;function Nt(){try{let e=localStorage.getItem(Mt);if(!e)return{};let t=JSON.parse(e);if(!t||typeof t!=`object`||Array.isArray(t))return{};let n={};for(let[e,r]of Object.entries(t))typeof r==`string`&&e in J&&(n[e]=r);return n}catch{return{}}}var Y=Nt(),X=new Set;function Z(){try{localStorage.setItem(Mt,JSON.stringify(Y))}catch{}}function Q(){for(let e of X)e()}function Pt(e){return X.add(e),()=>X.delete(e)}function Ft(){return Y}var $=Object.keys(J).sort(),It=jt;function Lt(e){return Y[e]??J[e]??``}function Rt(e){return J[e]??``}function zt(e){return e in Y}function Bt(){return Object.keys(Y).sort()}function Vt(e,t){if(e in J){if(t===J[e]){if(!(e in Y))return;delete Y[e]}else{if(Y[e]===t)return;Y[e]=t}Y={...Y},Z(),Q()}}function Ht(e){e in Y&&(delete Y[e],Y={...Y},Z(),Q())}function Ut(){Object.keys(Y).length!==0&&(Y={},Z(),Q())}function Wt(){let e=[];for(let t of Bt())e.push(Gt(t,Rt(t),Lt(t)));return e.join(``)}function Gt(e,t,n){let r=t.length?t.split(`
`):[],i=n.length?n.split(`
`):[];return[`diff --git a/${e} b/${e}`,`--- a/${e}`,`+++ b/${e}`,`@@ -1,${r.length} +1,${i.length} @@`,...r.map(e=>`-${e}`),...i.map(e=>`+${e}`)].join(`
`)+`
`}var Kt=`find.ide.open.v1`;function qt(){try{let e=localStorage.getItem(Kt);if(e&&$.includes(e))return e}catch{}return $.includes(`README.md`)?`README.md`:$[0]??``}function Jt(){let e=(0,b.useSyncExternalStore)(Pt,Ft),[t,n]=(0,b.useState)(qt),[r,i]=(0,b.useState)(!1),[a,o]=(0,b.useState)(!1),[s,c]=(0,b.useState)(null),[l,u]=(0,b.useState)(null),d=(0,b.useRef)(null);At(d);let f=Object.keys(e).length,p=t in e,m=(0,b.useCallback)(e=>{n(e),i(!1);try{localStorage.setItem(Kt,e)}catch{}},[]),h=e=>{c(e),o(!1),window.setTimeout(()=>c(null),2400)};return(0,q.jsxs)(`div`,{className:`ide-app`,ref:d,children:[(0,q.jsxs)(`header`,{className:`ide-bar`,children:[(0,q.jsx)(`button`,{type:`button`,className:`ide-bar__btn`,onClick:()=>i(e=>!e),"aria-label":`Files`,"aria-expanded":r,"data-tip":`Files`,children:`☰`}),(0,q.jsxs)(`div`,{className:`ide-bar__file`,children:[(0,q.jsx)(`span`,{className:`ide-bar__path`,children:t||`No file`}),p&&(0,q.jsx)(`span`,{className:`ide-bar__dot`,"aria-label":`Edited`})]}),(0,q.jsx)(`button`,{type:`button`,className:`ide-bar__btn`,onClick:()=>o(e=>!e),"aria-label":`Actions`,"aria-expanded":a,"data-tip":`Actions`,"data-tip-align":`end`,children:`⋯`}),a&&(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(`div`,{className:`ide-scrim`,onClick:()=>o(!1)}),(0,q.jsxs)(`div`,{className:`ide-menu`,role:`menu`,children:[(0,q.jsx)(`button`,{type:`button`,role:`menuitem`,disabled:!p,onClick:()=>{Ht(t),h(`Reverted this file.`)},children:`Revert this file`}),(0,q.jsxs)(`button`,{type:`button`,role:`menuitem`,disabled:f===0,onClick:async()=>{let e=Wt();if(!e)return h(`Nothing edited yet.`);try{await navigator.clipboard.writeText(e),h(`Copied a patch for ${f} file${f===1?``:`s`}.`)}catch{h(`Clipboard blocked — use Download instead.`)}},children:[`Copy patch`,f>0&&` (${f})`]}),(0,q.jsx)(`button`,{type:`button`,role:`menuitem`,disabled:f===0,onClick:()=>{let e=Wt();if(!e)return h(`Nothing edited yet.`);let t=URL.createObjectURL(new Blob([e],{type:`text/x-patch`})),n=document.createElement(`a`);n.href=t,n.download=`find.patch`,n.click(),URL.revokeObjectURL(t),h(`Patch downloaded.`)},children:`Download patch`}),(0,q.jsx)(`button`,{type:`button`,role:`menuitem`,className:`ide-menu__danger`,disabled:f===0,onClick:()=>{Ut(),h(`All edits reverted.`)},children:`Revert all edits`}),(0,q.jsxs)(`p`,{className:`ide-menu__note`,children:[`Edits stay on this device. Snapshot taken`,` `,new Date(It).toLocaleDateString(),`.`]})]})]})]}),(0,q.jsxs)(`div`,{className:`ide-body`,children:[r&&(0,q.jsx)(`div`,{className:`ide-scrim ide-scrim--drawer`,onClick:()=>i(!1)}),(0,q.jsx)(`aside`,{className:`ide-side${r?` ide-side--open`:``}`,children:(0,q.jsx)(Dt,{paths:$,current:t,dirty:zt,onPick:m})}),(0,q.jsx)(`main`,{className:`ide-main`,children:t?(0,q.jsx)(wt,{path:t,initialText:Lt(t),onChange:e=>Vt(t,e),onReady:u}):(0,q.jsx)(`p`,{className:`ide-empty`,children:`No files in the snapshot.`})})]}),(0,q.jsx)(kt,{view:l}),s&&(0,q.jsx)(`div`,{className:`ide-toast`,role:`status`,children:s})]})}var Yt=Jt;export{Yt as default};
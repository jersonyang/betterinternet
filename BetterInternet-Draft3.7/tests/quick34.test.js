const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]),ctx=vm.createContext({console});vm.runInContext(scripts.find(s=>s.includes('root.Quick34=')),ctx);let Q=ctx.Quick34;let n=0;function test(name,f){f();n++;console.log('PASS',name)}
test('900 devices and 300 Mbps gives a 1/3 Mbps theoretical average',()=>{let r=Q.estimate({devices:900,down:300});assert.equal(r.share,1/3);assert.equal(r.rows[1].all.down,150);assert.equal(r.rows[3].all.down,60);assert.equal(r.rows[1].all.both,null)});
test('AP exam budget uses independent directions',()=>{let r=Q.estimate({devices:900,down:300,up:100,students:200,exam:'ap'});assert.equal(r.needD,200);assert.equal(r.needU,40);assert.equal(r.remD,100);assert.equal(r.remU,60);assert.equal(r.rows[1].rooms.both,1)});
test('SAT and PSAT published minimums',()=>{let r=Q.estimate({down:300,up:300,students:200,exam:'sat'});assert.equal(r.needD,40);assert.equal(r.needU,40);assert.equal(r.remD,260)});
test('Unknown input stays unknown, not zero',()=>{let r=Q.estimate({devices:null,down:'',up:null,students:undefined});assert.equal(r.N,null);assert.equal(r.D,null);assert.equal(r.U,null);assert.equal(r.S,null);assert.equal(r.remD,null);assert.equal(r.share,null)});
test('Known outside traffic is subtracted once',()=>{let r=Q.estimate({devices:900,down:300,up:100,students:200,exam:'ap',otherDown:25,otherUp:10});assert.equal(r.remD,75);assert.equal(r.remU,50)});
test('Upload bottleneck limits supported activity',()=>{let r=Q.estimate({down:300,up:1,students:0,exam:'ap'});assert.equal(r.rows[1].rooms.both,0);assert.equal(r.ap.both,5)});
test('Exam shortfall gives zero supported additional classrooms',()=>{let r=Q.estimate({down:100,up:100,students:200,exam:'ap'});assert.equal(r.remD,-100);assert.equal(r.rows[1].rooms.both,0)});
test('Zero link capacity remains a known zero',()=>{let r=Q.estimate({down:0,up:0,devices:30});assert.equal(r.share,0);assert.equal(r.ap.both,0)});
console.log(n+' quick assessment tests passed');

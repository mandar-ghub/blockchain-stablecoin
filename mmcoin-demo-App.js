import { useState, useCallback } from "react";

const C = {
  blue:"#1a4fd6", blueLt:"#e8eefb", blueDk:"#0c447c",
  teal:"#0f7b6c", tealLt:"#e0f5f2",
  amber:"#b45309", amberLt:"#fef3c7",
  coral:"#c2410c", coralLt:"#fff1ee",
  purple:"#6d28d9", purpleLt:"#f0ebff",
  green:"#15803d", greenLt:"#dcfce7",
  red:"#b91c1c", redLt:"#fee2e2",
  gray:"#6b7280",
};
const s = {
  card:{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:10,padding:"1.25rem"},
  field:{marginBottom:12},
  label:{fontSize:12,color:"#6b7280",marginBottom:4,display:"block"},
  inp:{width:"100%",padding:"8px 10px",fontSize:13,border:"0.5px solid var(--color-border-secondary)",borderRadius:6,background:"var(--color-background-primary)",color:"var(--color-text-primary)"},
  divider:{height:"0.5px",background:"var(--color-border-tertiary)",margin:"0.85rem 0"},
  eyebrow:{fontSize:11,fontWeight:500,letterSpacing:"0.06em",textTransform:"uppercase",color:"#6b7280",marginBottom:8},
};
const Badge=({color,bg,children,style={}})=><span style={{display:"inline-flex",alignItems:"center",gap:3,fontSize:11,fontWeight:500,padding:"2px 8px",borderRadius:20,background:bg,color,...style}}>{children}</span>;
const Btn=({onClick,disabled,children,bg=C.blue,color="#fff",outline=false,style={}})=><button onClick={onClick} disabled={disabled} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"8px 16px",fontSize:13,fontWeight:500,borderRadius:6,cursor:disabled?"not-allowed":"pointer",border:outline?"0.5px solid var(--color-border-secondary)":"none",background:outline?"transparent":bg,color:outline?"var(--color-text-primary)":color,opacity:disabled?0.4:1,...style}}>{children}</button>;
const Field=({label,children})=><div style={s.field}><label style={s.label}>{label}</label>{children}</div>;
const Inp=({value,onChange,type="text",placeholder="",disabled=false,style={}})=><input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} disabled={disabled} style={{...s.inp,...style}}/>;
const Sel=({value,onChange,options,disabled=false})=><select value={value} onChange={e=>onChange(e.target.value)} disabled={disabled} style={{...s.inp,cursor:"pointer"}}>{options.map(o=><option key={o.value||o} value={o.value||o}>{o.label||o}</option>)}</select>;
const CheckRow=({icon,iconBg,iconColor,title,desc,badge,badgeBg,badgeColor,last=false})=>(
  <div style={{display:"flex",alignItems:"flex-start",gap:10,padding:"9px 0",borderBottom:last?"none":"0.5px solid var(--color-border-tertiary)"}}>
    <div style={{width:24,height:24,borderRadius:"50%",background:iconBg,color:iconColor,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0,marginTop:1}}>{icon}</div>
    <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500}}>{title}</div>{desc&&<div style={{fontSize:11,color:C.gray,marginTop:2}}>{desc}</div>}</div>
    {badge&&<Badge bg={badgeBg||"var(--color-background-secondary)"} color={badgeColor||C.gray}>{badge}</Badge>}
  </div>
);
const AuditEntry=({dot,msg,who,time})=>(
  <div style={{display:"flex",gap:8,padding:"7px 0",borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
    <div style={{width:7,height:7,borderRadius:"50%",background:dot,flexShrink:0,marginTop:6}}/>
    <div><div style={{fontSize:12}}>{msg}</div><div style={{fontSize:11,color:C.gray}}>{who} - {time}</div></div>
  </div>
);
const PipelineDot=({icon,label,state})=>{
  const bg=state==="done"?C.teal:state==="active"?C.blue:state==="blocked"?C.red:state==="warn"?C.amber:"var(--color-background-secondary)";
  const lc=state==="done"?C.teal:state==="active"?C.blue:state==="blocked"?C.red:"var(--color-text-secondary)";
  return <div style={{display:"flex",flexDirection:"column",alignItems:"center",minWidth:72}}><div style={{width:28,height:28,borderRadius:"50%",background:bg,color:state?"#fff":C.gray,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,border:"2px solid "+(bg==="var(--color-background-secondary)"?"var(--color-border-secondary)":bg),boxShadow:state==="active"?"0 0 0 4px "+C.blueLt:"none"}}>{icon}</div><div style={{fontSize:10,color:lc,marginTop:4,textAlign:"center",lineHeight:1.3,fontWeight:state==="active"||state==="done"?500:400}}>{label}</div></div>;
};
const PipelineLine=({done})=><div style={{flex:1,height:2,background:done?C.teal:"var(--color-border-tertiary)",marginTop:-14}}/>;

const FX_DEFAULT=90;
const RAILS_IN={upi:{time:"Instant",short:"UPI"},imps:{time:"Instant (24x7)",short:"IMPS"},neft:{time:"~30 min",short:"NEFT"},rtgs:{time:"Instant high-val",short:"RTGS"}};
const RAILS_US={ach:{time:"1-2 business days",short:"ACH"},achSame:{time:"Same day",short:"Same-day ACH"},wire:{time:"Same day",short:"Wire"},rtp:{time:"Instant (24x7)",short:"RTP"},fedNow:{time:"Instant (24x7)",short:"FedNow"}};
const KYC_SC={
  clean:      {name:"Jon Doe", risk:2,label:"Low risk",    lc:C.green, lb:C.greenLt, sanctions:false,pep:false,structuring:false,edd:false,amt:500},
  edd:        {name:"Jane Doe",   risk:5,label:"Medium risk", lc:C.amber, lb:C.amberLt, sanctions:false,pep:false,structuring:false,edd:true, amt:4500},
  sanctions:  {name:"John Roe",risk:9,label:"High risk",   lc:C.red,   lb:C.redLt,   sanctions:true, pep:false,structuring:false,edd:false,amt:2000},
  structuring:{name:"Jamie Roe",  risk:7,label:"High risk",   lc:C.red,   lb:C.redLt,   sanctions:false,pep:false,structuring:true, edd:false,amt:2999},
  pep:        {name:"Alex Poe",  risk:6,label:"Medium (PEP)",lc:C.purple,lb:C.purpleLt,sanctions:false,pep:true, structuring:false,edd:false,amt:1500},
};

// Transaction event schema passed from all modules to App:
// { type:"retail"|"b2b"|"manual"|"audit"
//   gross: USD sent by customer
//   ssFee | fiFee: service provider fee
//   mmFee: MMCoin Labs fee
//   mmcMinted: net MMC issued
//   mmcBurned: MMC destroyed on off-ramp
//   provider: "SwiftSend"|"GlobalFirst"|"Operator"
//   corridor: "us-in"|"in-us"
//   fxRate: rate used
//   label: short display string
//   color: dot color for audit trail
//   who: actor string
// }

// ─── Entity Banner ────────────────────────────────────────────────────────────
const EntityBanner=({fxRate,setFxRate})=>(
  <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:"1.25rem"}}>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
      {[{role:"Stablecoin operator",name:"MMCoin Labs",sub:"Mints & burns MMC - holds USD reserve - maintains ledger",badge:"Token issuer",bc:C.amber,bl:C.amberLt},
        {role:"Remittance service provider",name:"SwiftSend",sub:"Consumer app - KYC/AML - US & India rail integrations",badge:"Retail MSP",bc:C.blue,bl:C.blueLt},
        {role:"Financial institution",name:"GlobalFirst Bank",sub:"Corporate treasury product - nostro/vostro - B2B rails",badge:"B2B FI",bc:C.purple,bl:C.purpleLt}
      ].map(e=>(
        <div key={e.name} style={{borderRadius:10,padding:"10px 14px",border:"1.5px solid "+e.bc,background:e.bl,position:"relative"}}>
          <Badge bg={e.bl} color={e.bc} style={{position:"absolute",top:8,right:10}}>{e.badge}</Badge>
          <div style={{fontSize:10,fontWeight:600,textTransform:"uppercase",color:e.bc,marginBottom:3}}>{e.role}</div>
          <div style={{fontSize:14,fontWeight:500}}>{e.name}</div>
          <div style={{fontSize:11,color:C.gray,marginTop:2}}>{e.sub}</div>
        </div>
      ))}
    </div>
    <div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 14px",background:C.amberLt,border:"0.5px solid #f59e0b",borderRadius:6,fontSize:13,flexWrap:"wrap"}}>
      <span style={{color:C.amber,fontWeight:500}}>FX rate (MMCoin Labs):</span>
      <span style={{color:C.gray,fontSize:12}}>1 USD =</span>
      <input type="number" value={fxRate} min="1" step="0.5" onChange={e=>setFxRate(parseFloat(e.target.value)||90)} style={{width:70,padding:"3px 7px",fontSize:13,border:"0.5px solid #f59e0b",borderRadius:4,background:"var(--color-background-primary)",color:C.amber,fontWeight:600}}/>
      <span style={{color:C.amber,fontWeight:600}}>INR</span>
      <span style={{color:C.gray,fontSize:11}}>- 1 INR = {(1/fxRate).toFixed(4)} USD</span>
      <span style={{marginLeft:"auto"}}><Badge bg={C.amberLt} color={C.amber}>MMC peg: 1 MMC = $1 USD</Badge></span>
    </div>
  </div>
);

// ─── KYC Module ───────────────────────────────────────────────────────────────
const KYCModule=({addTxEvent})=>{
  const [scenario,setScenario]=useState("clean");
  const [stage,setStage]=useState(0);
  const [idRes,setIdRes]=useState([]);
  const [amlRes,setAmlRes]=useState([]);
  const [txnRes,setTxnRes]=useState([]);
  const [audit,setAudit]=useState([]);
  const [running,setRunning]=useState(false);
  const [outcome,setOutcome]=useState(null);
  const sc=KYC_SC[scenario];
  const nt=()=>new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"});
  const addAudit=(msg,who,color)=>{setAudit(a=>[{msg,who,color,time:nt()},...a]);addTxEvent({type:"audit",label:msg,who,color,time:nt()});};
  const ci=(p)=>p===true||p==="pass"?"V":p==="warn"?"!":"X";
  const cb=(p)=>p===true||p==="pass"?C.greenLt:p==="warn"?C.amberLt:C.redLt;
  const cc=(p)=>p===true||p==="pass"?C.green:p==="warn"?C.amber:C.red;
  const run=()=>{
    setRunning(true);setStage(1);setIdRes([]);setAmlRes([]);setTxnRes([]);setOutcome(null);
    addAudit("KYC submission received - "+sc.name,"SwiftSend system",C.blue);
    addAudit("Risk score: "+sc.risk+" ("+sc.label+")","SwiftSend compliance",C.amber);
    const idChecks=[{title:"Document authenticity",pass:!sc.sanctions,detail:sc.sanctions?"MRZ inconsistencies":"MRZ, hologram verified"},{title:"Document expiry",pass:true,detail:"Valid - expires Mar 2030"},{title:"Facial biometric match",pass:!sc.sanctions,detail:sc.sanctions?"Low confidence":"98.4% match"},{title:"Liveness detection",pass:true,detail:"3D depth check passed"},{title:"Address verification",pass:true,detail:"USPS + Experian matched"},{title:"Age verification",pass:true,detail:"18+ confirmed"}];
    idChecks.forEach((c,i)=>setTimeout(()=>{setIdRes(r=>[...r,c]);if(i===idChecks.length-1) setTimeout(()=>{
      const ok=idChecks.every(c=>c.pass);
      addAudit(ok?"Identity verified - 6/6 checks":"Identity FAILED","Jumio (via SwiftSend)",ok?C.teal:C.red);
      if(!ok){setOutcome("blocked");setRunning(false);return;}
      setStage(2);
      const amlChecks=[{title:"OFAC SDN list",pass:!sc.sanctions,detail:sc.sanctions?"MATCH: "+sc.name:"No match"},{title:"UN & EU lists",pass:!sc.sanctions,detail:sc.sanctions?"Possible EU match":"Clear"},{title:"PEP database",pass:!sc.pep,detail:sc.pep?"PEP match: govt official":"Not a PEP"},{title:"Adverse media",pass:true,detail:"No adverse media"},{title:"Country risk (India)",pass:true,detail:"India is FATF-compliant"},{title:"FinCEN 314(a)",pass:!sc.sanctions,detail:sc.sanctions?"Possible 314(a) match":"Clear"}];
      amlChecks.forEach((c,j)=>setTimeout(()=>{setAmlRes(r=>[...r,c]);if(j===amlChecks.length-1) setTimeout(()=>{
        if(sc.sanctions){addAudit("SANCTIONS HIT - account frozen","WorldCheck (SwiftSend)",C.red);addAudit("SAR filing initiated","SwiftSend compliance",C.amber);setOutcome("sanctions");setRunning(false);return;}
        addAudit(sc.pep?"PEP identified - EDD applied":"AML screening passed",sc.pep?"WorldCheck":"WorldCheck",sc.pep?C.purple:C.teal);
        setStage(3);
        const txnChecks=[{title:"Transaction limit",pass:sc.amt<=2999?"pass":"warn",detail:sc.amt>2999?"$"+sc.amt.toLocaleString()+" exceeds $2,999 - EDD":"$"+sc.amt.toLocaleString()+" within limit"},{title:"Daily velocity",pass:"pass",detail:"$"+sc.amt.toLocaleString()+" within $5,000 daily"},{title:"Structuring detection",pass:sc.structuring?false:"pass",detail:sc.structuring?"ALERT: 4 prior $2,999 transfers in 7 days":"No pattern"},{title:"Recipient screening",pass:"pass",detail:"Recipient - no match"},{title:"Purpose validation",pass:"pass",detail:"Consistent with profile"}];
        txnChecks.forEach((c,k)=>setTimeout(()=>{setTxnRes(r=>[...r,c]);if(k===txnChecks.length-1) setTimeout(()=>{
          if(sc.structuring){addAudit("Structuring alert - blocked","SwiftSend AML",C.red);addAudit("SAR filed","SwiftSend compliance",C.amber);setOutcome("structuring");}
          else if(sc.edd||sc.amt>2999){addAudit("EDD triggered - $"+sc.amt.toLocaleString()+" exceeds threshold","SwiftSend compliance",C.amber);setOutcome("edd");}
          else{addAudit("Transaction cleared - all gates passed","SwiftSend compliance",C.teal);addAudit("Released to MMCoin Labs rails","SwiftSend system",C.teal);setOutcome("pass");setStage(4);}
          setRunning(false);
        },400);},450*(k+1)));
      },600);},400*(j+1)));
    },600);},450*(i+1)));
  };
  const ps=[0,1,2,3,4].map(i=>{if(i<stage) return "done";if(i===stage) return(outcome==="blocked"||outcome==="sanctions"||outcome==="structuring")?"blocked":outcome==="edd"?"warn":"active";return "";});
  if(stage===4&&outcome==="pass") ps[4]="done";
  return (
    <div>
      <div style={{display:"flex",alignItems:"center",marginBottom:"1.5rem"}}>{["KYC form","Identity","AML screen","Txn review","Cleared"].map((l,i)=><span key={l} style={{display:"contents"}}>{i>0&&<PipelineLine done={ps[i-1]==="done"}/>}<PipelineDot icon={["P","ID","AM","TX","OK"][i]} label={l} state={ps[i]}/></span>)}</div>
      {stage===0&&(<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div style={s.card}>
          <div style={s.eyebrow}>Scenario</div>
          <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:16}}>{Object.entries(KYC_SC).map(([k,v])=><button key={k} onClick={()=>setScenario(k)} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",borderRadius:6,border:"0.5px solid "+(scenario===k?v.lc:"var(--color-border-secondary)"),background:scenario===k?v.lb:"transparent",cursor:"pointer",textAlign:"left",fontSize:13}}><Badge bg={v.lb} color={v.lc}>{k[0].toUpperCase()}</Badge><span style={{fontWeight:scenario===k?500:400}}>{v.name} - {v.label}</span></button>)}</div>
          <div style={s.eyebrow}>Risk: {sc.name}</div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}><span style={{fontSize:24,fontWeight:500}}>{sc.risk}</span><Badge bg={sc.lb} color={sc.lc}>{sc.label}</Badge></div>
          <div style={{display:"flex",gap:4,marginBottom:4}}>{[{c:C.greenLt,bc:C.green},{c:C.amberLt,bc:C.amber},{c:C.redLt,bc:C.red}].map((seg,i)=><div key={i} style={{flex:1,height:8,borderRadius:2,background:seg.c,border:"1px solid "+seg.bc,opacity:[sc.risk<=3,sc.risk>3&&sc.risk<=6,sc.risk>6][i]?1:0.25}}/>)}</div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:C.gray}}><span>Low</span><span>Medium</span><span>High</span></div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={s.card}>
            <div style={s.eyebrow}>Scenario: {sc.name}</div>
            {[["Sanctions",sc.sanctions?"OFAC hit expected":"None"],["PEP",sc.pep?"YES - EDD":"No"],["Structuring",sc.structuring?"Alert expected":"None"],["Send amount","$"+sc.amt.toLocaleString()]].map(([k,v])=><div key={k} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"0.5px solid var(--color-border-tertiary)",fontSize:13}}><span style={{color:C.gray}}>{k}</span><span style={{fontWeight:500}}>{v}</span></div>)}
          </div>
          <Btn onClick={run} bg={C.blue}>Run KYC and compliance gate</Btn>
        </div>
      </div>)}
      {stage>=1&&(<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {stage>=1&&<div style={s.card}><div style={s.eyebrow}>Identity checks{idRes.length<6&&running?" - running...":""}</div>{["Document authenticity","Document expiry","Facial biometric","Liveness","Address","Age"].map((t,i)=>{const r=idRes[i];return <CheckRow key={i} icon={r?ci(r.pass):"."} iconBg={r?cb(r.pass):"var(--color-background-secondary)"} iconColor={r?cc(r.pass):C.gray} title={t} desc={r?.detail} badge={r?(r.pass===true||r.pass==="pass"?"Pass":"Fail"):""} badgeBg={r?cb(r.pass):""} badgeColor={r?cc(r.pass):C.gray} last={i===5}/>;})}</div>}
          {stage>=2&&<div style={s.card}><div style={s.eyebrow}>AML screening{amlRes.length<6&&running?" - running...":""}</div>{["OFAC SDN","UN & EU lists","PEP database","Adverse media","Country risk","FinCEN 314(a)"].map((t,i)=>{const r=amlRes[i];return <CheckRow key={i} icon={r?ci(r.pass):"."} iconBg={r?cb(r.pass):"var(--color-background-secondary)"} iconColor={r?cc(r.pass):C.gray} title={t} desc={r?.detail} badge={r?(r.pass===true||r.pass==="pass"?"Clear":"MATCH"):""} badgeBg={r?cb(r.pass):""} badgeColor={r?cc(r.pass):C.gray} last={i===5}/>;})}</div>}
          {stage>=3&&<div style={s.card}><div style={s.eyebrow}>Transaction checks{txnRes.length<5&&running?" - running...":""}</div>{["Txn limit","Daily velocity","Structuring","Recipient screen","Purpose"].map((t,i)=>{const r=txnRes[i];return <CheckRow key={i} icon={r?ci(r.pass):"."} iconBg={r?cb(r.pass):"var(--color-background-secondary)"} iconColor={r?cc(r.pass):C.gray} title={t} desc={r?.detail} badge={r?(r.pass===true||r.pass==="pass"?"Pass":r.pass==="warn"?"EDD":"Blocked"):""} badgeBg={r?cb(r.pass):""} badgeColor={r?cc(r.pass):C.gray} last={i===4}/>;})}</div>}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {outcome&&(<div style={{...s.card,border:"1px solid "+(outcome==="pass"?C.teal:outcome==="edd"?C.amber:C.red)}}>
            <div style={s.eyebrow}>Decision</div>
            {outcome==="pass"&&<><Badge bg={C.greenLt} color={C.green} style={{marginBottom:8}}>Cleared - all gates passed</Badge><div style={{fontSize:12,color:C.gray}}>KYC verified, AML clear, within limits. Released to MMCoin Labs rails.</div></>}
            {outcome==="edd"&&<><Badge bg={C.amberLt} color={C.amber} style={{marginBottom:8}}>EDD hold - additional docs required</Badge><div style={{fontSize:12,color:C.gray}}>Amount over $3,000. Source of funds proof required.</div></>}
            {outcome==="blocked"&&<><Badge bg={C.redLt} color={C.red} style={{marginBottom:8}}>Identity failed - blocked</Badge><div style={{fontSize:12,color:C.gray}}>Document or biometric checks failed.</div></>}
            {outcome==="sanctions"&&<><Badge bg={C.redLt} color={C.red} style={{marginBottom:8}}>Sanctions hit - account frozen</Badge><div style={{fontSize:12,color:C.gray,marginBottom:8}}>OFAC SDN match. Account frozen. SAR required within 30 days.</div><Badge bg={C.amberLt} color={C.amber}>SAR filing required</Badge></>}
            {outcome==="structuring"&&<><Badge bg={C.redLt} color={C.red} style={{marginBottom:8}}>Structuring detected - blocked</Badge><div style={{fontSize:12,color:C.gray,marginBottom:8}}>Sub-$3,000 pattern (31 U.S.C. 5324). SAR filed.</div><Badge bg={C.amberLt} color={C.amber}>SAR filing required</Badge></>}
          </div>)}
          <div style={s.card}><div style={s.eyebrow}>Audit trail</div><div style={{maxHeight:280,overflowY:"auto",marginTop:8}}>{audit.length===0?<div style={{fontSize:12,color:C.gray,textAlign:"center",padding:12}}>No events yet</div>:audit.map((e,i)=><AuditEntry key={i} dot={e.color} msg={e.msg} who={e.who} time={e.time}/>)}</div></div>
          <Btn onClick={()=>{setStage(0);setIdRes([]);setAmlRes([]);setTxnRes([]);setAudit([]);setOutcome(null);}} outline>Reset</Btn>
        </div>
      </div>)}
    </div>
  );
};

// ─── Retail Module ────────────────────────────────────────────────────────────
const RetailModule=({fxRate,addTxEvent})=>{
  const [corridor,setCorridor]=useState("us-in");
  const [amount,setAmount]=useState("500");
  const [depUS,setDepUS]=useState("ach");
  const [delIN,setDelIN]=useState("upi");
  const [depIN,setDepIN]=useState("upi");
  const [delUS,setDelUS]=useState("ach");
  const isUSIN=corridor==="us-in";
  const raw=parseFloat(amount)||0;
  const usdAmt=isUSIN?raw:raw/fxRate;
  const ssFee=usdAmt*0.005, mmFee=usdAmt*0.001, net=usdAmt-ssFee-mmFee;
  const depR=isUSIN?RAILS_US[depUS]:RAILS_IN[depIN];
  const delR=isUSIN?RAILS_IN[delIN]:RAILS_US[delUS];
  const exec=()=>addTxEvent({
    type:"retail", provider:"SwiftSend", corridor,
    gross:usdAmt, fiFee:ssFee, mmFee, mmcMinted:net, mmcBurned:net,
    fxRate, depRail:depR?.short, delRail:delR?.short,
    label:"SwiftSend retail "+(isUSIN?"US→India":"India→US"),
    color:C.blue, who:"SwiftSend / MMCoin Labs",
  });
  return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:C.blueLt,borderRadius:6,border:"0.5px solid "+C.blue,marginBottom:"1rem"}}>
        <div style={{width:32,height:32,background:C.blue,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:16}}>S</div>
        <div><div style={{fontSize:13,fontWeight:500,color:C.blueDk}}>SwiftSend by Swift Financial Inc.</div><div style={{fontSize:11,color:C.gray}}>Licensed money transmitter - NMLS 1234567 - Powered by MMCoin Labs rails</div></div>
        <div style={{marginLeft:"auto",fontSize:12}}><span style={{color:C.gray}}>SwiftSend fee: </span><span style={{fontWeight:500,color:C.blue}}>0.5%</span></div>
        <div style={{fontSize:12,marginLeft:12}}><span style={{color:C.gray}}>MMCoin Labs: </span><span style={{fontWeight:500,color:C.amber}}>0.1%</span></div>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:"1rem"}}>{[["us-in","US to India"],["in-us","India to US"]].map(([v,l])=><button key={v} onClick={()=>setCorridor(v)} style={{flex:1,padding:8,borderRadius:6,fontSize:12,fontWeight:500,cursor:"pointer",border:"0.5px solid "+(corridor===v?C.blue:"var(--color-border-secondary)"),background:corridor===v?C.blueLt:"var(--color-background-secondary)",color:corridor===v?C.blue:"var(--color-text-secondary)"}}>{l}</button>)}</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div style={s.card}>
          <div style={s.eyebrow}>{isUSIN?"Send from US to India":"Send from India to US"}</div>
          <div style={s.divider}/>
          <div style={{borderRadius:6,padding:"8px 12px",marginBottom:8,background:C.blueLt,border:"0.5px solid "+C.blue,fontSize:12}}><div style={{fontWeight:600,color:C.blueDk,marginBottom:3}}>{isUSIN?"On-ramp - SwiftSend collects USD":"On-ramp - SwiftSend India collects INR"}</div><div style={{color:C.gray}}>Method: <span style={{fontWeight:500,color:"var(--color-text-primary)"}}>{depR?.short} - {depR?.time}</span></div></div>
          <div style={{borderRadius:6,padding:"8px 12px",marginBottom:12,background:C.tealLt,border:"0.5px solid "+C.teal,fontSize:12}}><div style={{fontWeight:600,color:C.teal,marginBottom:3}}>{isUSIN?"Off-ramp - SwiftSend India delivers INR":"Off-ramp - SwiftSend delivers USD"}</div><div style={{color:C.gray}}>Method: <span style={{fontWeight:500,color:"var(--color-text-primary)"}}>{delR?.short} - {delR?.time}</span></div></div>
          <Field label={isUSIN?"Amount (USD)":"Amount (INR)"}><Inp value={amount} onChange={setAmount} type="number"/></Field>
          {isUSIN?<><Field label="Deposit (US on-ramp)"><Sel value={depUS} onChange={setDepUS} options={[{value:"ach",label:"ACH - 1-2 days"},{value:"achSame",label:"Same-day ACH"},{value:"wire",label:"Wire - same day"}]}/></Field><Field label="Delivery (India off-ramp)"><Sel value={delIN} onChange={setDelIN} options={[{value:"upi",label:"UPI - instant"},{value:"imps",label:"IMPS - instant 24x7"},{value:"neft",label:"NEFT - 30 min"},{value:"rtgs",label:"RTGS - instant high-val"}]}/></Field></>
          :<><Field label="Deposit (India on-ramp)"><Sel value={depIN} onChange={setDepIN} options={[{value:"upi",label:"UPI - instant"},{value:"imps",label:"IMPS - instant 24x7"},{value:"neft",label:"NEFT - 30 min"},{value:"rtgs",label:"RTGS - instant high-val"}]}/></Field><Field label="Delivery (US off-ramp)"><Sel value={delUS} onChange={setDelUS} options={[{value:"ach",label:"ACH - 1-2 days"},{value:"achSame",label:"Same-day ACH"},{value:"wire",label:"Wire"},{value:"rtp",label:"RTP - instant"},{value:"fedNow",label:"FedNow - instant"}]}/></Field></>}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{...s.card,border:"1px solid "+C.blue,background:C.blueLt}}>
            <div style={{...s.eyebrow,color:C.blue}}>Transaction preview — fee breakdown</div>
            {/* Gross */}
            <div style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"5px 0",borderBottom:"0.5px solid var(--color-border-tertiary)"}}><span style={{color:C.gray}}>Customer sends</span><span style={{fontWeight:500}}>{isUSIN?"$"+raw.toFixed(2)+" USD":"Rs "+raw.toFixed(0)+" INR"}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"5px 0",borderBottom:"0.5px solid var(--color-border-tertiary)"}}><span style={{color:C.gray}}>Gross USD received</span><span style={{fontWeight:500,color:C.blueDk}}>${usdAmt.toFixed(2)}</span></div>
            {/* Fee deductions */}
            <div style={{background:"var(--color-background-secondary)",borderRadius:6,padding:"8px 10px",margin:"6px 0"}}>
              <div style={{fontSize:10,fontWeight:600,textTransform:"uppercase",color:C.gray,marginBottom:4}}>Fee deductions (why MMC minted is less than gross)</div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,padding:"3px 0"}}><span style={{color:C.blue}}>SwiftSend service fee (0.5%)</span><span style={{color:C.blue,fontWeight:500}}>- ${ssFee.toFixed(2)}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,padding:"3px 0"}}><span style={{color:C.amber}}>MMCoin Labs wholesale fee (0.1%)</span><span style={{color:C.amber,fontWeight:500}}>- ${mmFee.toFixed(2)}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:11,padding:"3px 0",borderTop:"0.5px solid var(--color-border-secondary)",marginTop:4,paddingTop:6,color:C.gray}}><span>SwiftSend net margin (0.4%)</span><span>${(ssFee-mmFee).toFixed(2)}</span></div>
            </div>
            {/* MMC minted = net */}
            <div style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"5px 0",borderBottom:"0.5px solid var(--color-border-tertiary)"}}><span style={{color:C.amber,fontWeight:500}}>MMCoin Labs mints (net USD into reserve)</span><span style={{color:C.amber,fontWeight:600}}>{net.toFixed(2)} MMC</span></div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,padding:"4px 0",borderBottom:"0.5px solid var(--color-border-tertiary)"}}><span style={{color:C.gray}}>FX rate (set by MMCoin Labs)</span><span>{isUSIN?"1 USD = "+fxRate+" INR":"1 INR = "+(1/fxRate).toFixed(4)+" USD"}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,padding:"4px 0",borderBottom:"0.5px solid var(--color-border-tertiary)"}}><span style={{color:C.gray}}>Deposit via</span><span>{depR?.short} - {depR?.time}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,padding:"4px 0",borderBottom:"0.5px solid var(--color-border-tertiary)"}}><span style={{color:C.gray}}>Delivery via</span><span>{delR?.short} - {delR?.time}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:15,fontWeight:600,padding:"8px 0",borderTop:"0.5px solid "+C.blue,marginTop:4}}><span>{isUSIN?"Recipient gets (INR)":"Recipient gets (USD)"}</span><span style={{color:C.teal}}>{isUSIN?"Rs "+Math.round(net*fxRate).toLocaleString():"$"+net.toFixed(2)}</span></div>
            {/* Explanation callout */}
            <div style={{background:C.amberLt,borderRadius:6,padding:"8px 10px",marginTop:4,fontSize:11,color:C.amber,lineHeight:1.5}}>
              <strong>Why MMC minted ({net.toFixed(2)}) differs from amount sent (${usdAmt.toFixed(2)}):</strong><br/>
              MMCoin Labs only mints against the net USD it custodies. Fees (${(ssFee+mmFee).toFixed(2)}) are deducted before minting so the reserve equals exactly the MMC in circulation.
            </div>
            <Btn onClick={exec} bg={C.blue} style={{width:"100%",justifyContent:"center",marginTop:12}}>Send via SwiftSend</Btn>
          </div>
          <div style={s.card}><div style={s.eyebrow}>Who does what</div>{["SwiftSend collects funds (on-ramp)","SwiftSend deducts its fee + Labs fee, sends net USD to Labs","MMCoin Labs mints net MMC into reserve","MMCoin Labs transfers MMC on-ledger (near-instant)","MMCoin Labs burns MMC, releases USD","SwiftSend delivers local currency (off-ramp)"].map((t,i)=><div key={i} style={{display:"flex",gap:10,padding:"7px 0",borderBottom:i===5?"none":"0.5px solid var(--color-border-tertiary)"}}><div style={{width:20,height:20,borderRadius:"50%",background:i<2||i===5?C.blueLt:i===5?C.tealLt:C.amberLt,color:i<2||i===5?C.blue:C.amber,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:600,flexShrink:0,marginTop:2}}>{i+1}</div><div style={{fontSize:12}}>{t}</div></div>)}</div>
        </div>
      </div>
    </div>
  );
};

// ─── B2B Module ───────────────────────────────────────────────────────────────
const B2BModule=({fxRate,addTxEvent})=>{
  const [corridor,setCorridor]=useState("us-in");
  const [client,setClient]=useState("techexport");
  const [amount,setAmount]=useState("250000");
  const [spread,setSpread]=useState("25");
  const [purpose,setPurpose]=useState("Supplier payment");
  const isUSIN=corridor==="us-in";
  const raw=parseFloat(amount)||0;
  const usdAmt=isUSIN?raw:raw/fxRate;
  const spreadBps=parseFloat(spread)||0;
  const fiFee=usdAmt*0.0015, spreadRev=usdAmt*spreadBps/10000, mmFee=usdAmt*0.0005;
  const fiNet=fiFee+spreadRev-mmFee, net=usdAmt-fiFee-spreadRev-mmFee;
  const effFX=isUSIN?fxRate-(spreadBps/10000)*fxRate:fxRate;
  const clients={techexport:{name:"TechExport Inc.",icon:"T",usd:"$4,200,000",inr:"Rs 120,000,000",limit:"$5,000,000"},pharmalink:{name:"PharmaLink Global",icon:"P",usd:"$2,100,000",inr:"Rs 890,000,000",limit:"$10,000,000"}};
  const cl=clients[client];
  const exec=()=>addTxEvent({
    type:"b2b", provider:"GlobalFirst", corridor,
    gross:usdAmt, fiFee:fiFee+spreadRev, mmFee, mmcMinted:net, mmcBurned:net,
    fxRate:effFX, spreadBps,
    label:"GlobalFirst B2B "+corridor+" - "+cl.name,
    color:C.purple, who:"GlobalFirst Bank / MMCoin Labs",
  });
  return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:C.purpleLt,borderRadius:6,border:"0.5px solid "+C.purple,marginBottom:"1rem"}}>
        <div style={{width:32,height:32,background:C.purple,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:16}}>B</div>
        <div><div style={{fontSize:13,fontWeight:500,color:C.purple}}>GlobalFirst Bank - Corporate Treasury Portal</div><div style={{fontSize:11,color:C.gray}}>Licensed bank - MMCoin-powered cross-border treasury</div></div>
        <div style={{marginLeft:"auto",fontSize:12}}><span style={{color:C.gray}}>GF fee: </span><span style={{fontWeight:500,color:C.purple}}>0.15% + spread</span></div>
        <div style={{fontSize:12,marginLeft:12}}><span style={{color:C.gray}}>MMCoin Labs: </span><span style={{fontWeight:500,color:C.amber}}>0.05%</span></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={s.card}><div style={s.eyebrow}>Corporate clients</div>{Object.entries(clients).map(([k,v])=><div key={k} onClick={()=>setClient(k)} style={{border:"0.5px solid "+(client===k?C.purple:"var(--color-border-secondary)"),borderRadius:8,overflow:"hidden",marginBottom:8,cursor:"pointer"}}><div style={{background:client===k?C.purpleLt:"var(--color-background-secondary)",padding:"10px 14px",display:"flex",alignItems:"center",gap:8}}><div style={{width:28,height:28,background:C.purple,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:14}}>{v.icon}</div><div style={{fontSize:13,fontWeight:500}}>{v.name}</div><Badge bg={C.purpleLt} color={C.purple} style={{marginLeft:"auto"}}>Tier 1</Badge></div><div style={{padding:"8px 14px"}}>{[["US acct",v.usd],["India acct",v.inr],["Daily limit",v.limit]].map(([l,val])=><div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:12,padding:"3px 0",borderBottom:"0.5px solid var(--color-border-tertiary)"}}><span style={{color:C.gray}}>{l}</span><span style={{fontWeight:500}}>{val}</span></div>)}</div></div>)}</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={s.card}>
            <Field label="Corridor"><Sel value={corridor} onChange={setCorridor} options={[{value:"us-in",label:"US to India"},{value:"in-us",label:"India to US"}]}/></Field>
            <Field label={isUSIN?"Amount (USD)":"Amount (INR)"}><Inp value={amount} onChange={setAmount} type="number"/></Field>
            <Field label="Purpose"><Sel value={purpose} onChange={setPurpose} options={["Supplier payment","Payroll funding","Capital repatriation","Intercompany loan","Trade finance"]}/></Field>
            <Field label="GlobalFirst spread (bps)"><Inp value={spread} onChange={setSpread} type="number"/><div style={{fontSize:11,color:C.gray,marginTop:3}}>{spreadBps} bps = {(spreadBps/100).toFixed(2)}% on FX</div></Field>
          </div>
          <div style={{...s.card,border:"1px solid "+C.purple,background:C.purpleLt}}>
            <div style={{...s.eyebrow,color:C.purple}}>Fee breakdown — why MMC minted differs</div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"5px 0",borderBottom:"0.5px solid var(--color-border-tertiary)"}}><span style={{color:C.gray}}>Client account debited</span><span style={{fontWeight:500}}>{isUSIN?"$"+usdAmt.toLocaleString("en-US",{minimumFractionDigits:2}):"Rs "+raw.toLocaleString()}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"5px 0",borderBottom:"0.5px solid var(--color-border-tertiary)"}}><span style={{color:C.gray}}>Gross USD into rails</span><span style={{fontWeight:500,color:C.blueDk}}>${usdAmt.toFixed(2)}</span></div>
            <div style={{background:"var(--color-background-secondary)",borderRadius:6,padding:"8px 10px",margin:"6px 0"}}>
              <div style={{fontSize:10,fontWeight:600,textTransform:"uppercase",color:C.gray,marginBottom:4}}>Fee deductions before minting</div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,padding:"3px 0"}}><span style={{color:C.purple}}>GlobalFirst service fee (0.15%)</span><span style={{color:C.purple,fontWeight:500}}>- ${fiFee.toFixed(2)}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,padding:"3px 0"}}><span style={{color:C.purple}}>FX spread revenue ({spreadBps} bps)</span><span style={{color:C.purple,fontWeight:500}}>- ${spreadRev.toFixed(2)}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,padding:"3px 0"}}><span style={{color:C.amber}}>MMCoin Labs institutional fee (0.05%)</span><span style={{color:C.amber,fontWeight:500}}>- ${mmFee.toFixed(2)}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:11,padding:"3px 0",borderTop:"0.5px solid var(--color-border-secondary)",marginTop:4,paddingTop:6,color:C.green}}><span>GlobalFirst net revenue</span><span style={{fontWeight:500}}>${fiNet.toFixed(2)}</span></div>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"5px 0",borderBottom:"0.5px solid var(--color-border-tertiary)"}}><span style={{color:C.amber,fontWeight:500}}>MMCoin Labs mints (net into reserve)</span><span style={{color:C.amber,fontWeight:600}}>{net.toFixed(2)} MMC</span></div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,padding:"4px 0",borderBottom:"0.5px solid var(--color-border-tertiary)"}}><span style={{color:C.gray}}>Effective FX (after spread)</span><span>{isUSIN?"1 USD = "+effFX.toFixed(2)+" INR":"1 INR = "+(1/fxRate).toFixed(4)+" USD"}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:15,fontWeight:600,padding:"8px 0",borderTop:"0.5px solid "+C.purple,marginTop:4}}><span>Client account credited</span><span style={{color:C.purple}}>{isUSIN?"Rs "+Math.round(net*effFX).toLocaleString():"$"+net.toFixed(2)}</span></div>
            <div style={{background:C.amberLt,borderRadius:6,padding:"8px 10px",marginTop:4,fontSize:11,color:C.amber,lineHeight:1.5}}>
              <strong>Why MMC minted ({net.toFixed(0)}) differs from gross (${usdAmt.toFixed(0)}):</strong><br/>
              Total fees deducted: ${(fiFee+spreadRev+mmFee).toFixed(2)} (GF: ${(fiFee+spreadRev).toFixed(2)} + Labs: ${mmFee.toFixed(2)}). MMCoin Labs only custodies and mints against the net.
            </div>
            <Btn onClick={exec} bg={C.purple} style={{width:"100%",justifyContent:"center",marginTop:12}}>Execute treasury transfer</Btn>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Dual Approval Module ─────────────────────────────────────────────────────
const ApprovalModule=({fxRate,addTxEvent})=>{
  const [user,setUser]=useState("riya");
  const [stage,setStage]=useState("draft");
  const [approvals,setApprovals]=useState({david:null,priya:null});
  const [amount,setAmount]=useState("850000");
  const [corridor,setCorridor]=useState("us-in");
  const [purpose,setPurpose]=useState("Supplier payment");
  const [notes,setNotes]=useState("");
  const [approverNote,setApproverNote]=useState("");
  const [audit,setAudit]=useState([]);
  const nt=()=>new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"});
  const usdAmt=corridor==="us-in"?parseFloat(amount)||0:(parseFloat(amount)||0)/fxRate;
  const needsDual=usdAmt>500000;
  const addAudit=(msg,who,color)=>{setAudit(a=>[{msg,who,color,time:nt()},...a]);addTxEvent({type:"audit",label:msg,who,color,time:nt()});};
  const pm={draft:0,submitted:1,approved1:2,approved2:3,executing:4,settled:5,rejected:-1};
  const pi=pm[stage]??0;
  const ps=(i)=>stage==="rejected"&&i===1?"blocked":i<pi?"done":i===pi?"active":"";
  const submit=()=>{setStage("submitted");addAudit("Transfer submitted TXN-2024-00142 - $"+usdAmt.toLocaleString("en-US",{maximumFractionDigits:0}),"Maker 1",C.blue);};
  const approve=()=>{if(user==="david"){setApprovals(a=>({...a,david:"approved"}));addAudit("Approval 1 granted","Approver 1",C.green);needsDual?setStage("approved1"):setStage("approved2");}else{setApprovals(a=>({...a,priya:"approved"}));addAudit("Approval 2 granted (CFO)","Approver 2",C.purple);setStage("approved2");}setApproverNote("");};
  const reject=()=>{setApprovals(a=>({...a,[user]:"rejected"}));addAudit("Transfer rejected - "+(approverNote||"no reason"),user==="david"?"Approver 1":"Approver 2",C.red);setStage("rejected");setApproverNote("");};
  const execute=()=>{
    setStage("executing");addAudit("Execution sent to MMCoin Labs","GlobalFirst (System)",C.amber);
    const mmFee=usdAmt*0.0005, fiFee=usdAmt*0.0015, spreadRev=usdAmt*25/10000;
    const net=usdAmt-fiFee-spreadRev-mmFee;
    setTimeout(()=>{
      setStage("settled");addAudit("MMCoin minted, transferred, burned - client credited","MMCoin Labs",C.teal);
      addTxEvent({type:"b2b",provider:"GlobalFirst",corridor,gross:usdAmt,fiFee:fiFee+spreadRev,mmFee,mmcMinted:net,mmcBurned:net,fxRate,label:"GlobalFirst B2B dual-approval settled",color:C.purple,who:"GlobalFirst / MMCoin Labs"});
    },1500);
  };
  const reset=()=>{setStage("draft");setApprovals({david:null,priya:null});setAudit([]);setApproverNote("");};
  const tier=usdAmt<100000?"Low":usdAmt<500000?"Medium":"High";
  const tierColor=usdAmt<100000?C.green:usdAmt<500000?C.amber:C.purple;
  const canApprove=(user==="david"&&stage==="submitted"&&!approvals.david)||(user==="priya"&&(stage==="approved1"||(!needsDual&&stage==="submitted"))&&!approvals.priya);
  return (
    <div>
      <div style={{display:"flex",gap:8,marginBottom:"1rem",padding:"10px",background:"var(--color-background-secondary)",borderRadius:6,alignItems:"center",flexWrap:"wrap"}}>
        <span style={{fontSize:12,color:C.gray,fontWeight:500}}>Acting as:</span>
        {[{k:"riya",name:"Maker 1",role:"Maker",c:C.blue},{k:"david",name:"Approver 1",role:"Approver 1",c:C.green},{k:"priya",name:"Approver 2",role:"CFO Approver 2",c:C.purple}].map(u=><button key={u.k} onClick={()=>setUser(u.k)} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",borderRadius:6,fontSize:12,cursor:"pointer",border:"0.5px solid "+(user===u.k?u.c:"var(--color-border-secondary)"),background:user===u.k?u.c+"18":"var(--color-background-primary)",color:user===u.k?u.c:"var(--color-text-secondary)"}}><div style={{width:22,height:22,borderRadius:"50%",background:u.c,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700}}>{u.name.split(" ").map(w=>w[0]).join("").slice(0,2)}</div>{u.name}<Badge bg={user===u.k?u.c+"18":"var(--color-background-secondary)"} color={user===u.k?u.c:C.gray} style={{fontSize:10}}>{u.role}</Badge></button>)}
      </div>
      <div style={{display:"flex",alignItems:"center",marginBottom:"1.5rem"}}>{["Draft","Submitted","Approval 1","Approval 2","Executing","Settled"].map((l,i)=><span key={l} style={{display:"contents"}}>{i>0&&<PipelineLine done={ps(i-1)==="done"}/>}<PipelineDot icon={["E","S","1","2","M","OK"][i]} label={l} state={ps(i)}/></span>)}</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={s.card}>
            <div style={s.eyebrow}>Transfer request{stage!=="draft"&&<span style={{fontSize:10,color:C.gray}}> TXN-2024-00142</span>}</div>
            <Field label="Corridor"><Sel value={corridor} onChange={setCorridor} disabled={stage!=="draft"} options={[{value:"us-in",label:"US to India"},{value:"in-us",label:"India to US"}]}/></Field>
            <Field label={corridor==="us-in"?"Amount (USD)":"Amount (INR)"}><Inp value={amount} onChange={setAmount} type="number" disabled={stage!=="draft"}/></Field>
            <Field label="Purpose"><Sel value={purpose} onChange={setPurpose} disabled={stage!=="draft"} options={["Supplier payment","Payroll funding","Capital repatriation","Intercompany loan","Trade finance"]}/></Field>
            <Field label="Notes"><Inp value={notes} onChange={setNotes} disabled={stage!=="draft"} placeholder="e.g. Q3 vendor payment ref BM-2024-09"/></Field>
            <div style={s.divider}/>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:12,color:C.gray}}>Risk tier</span><Badge bg={tierColor+"18"} color={tierColor}>{tier}{tier==="High"?" - dual approval":""}</Badge></div>
            <div style={{display:"flex",gap:4}}>{[C.green,C.amber,C.purple].map((c,i)=><div key={i} style={{flex:1,height:6,borderRadius:2,background:c+"22",border:"1px solid "+c,opacity:[usdAmt<100000,usdAmt>=100000&&usdAmt<500000,usdAmt>=500000][i]?1:0.3}}/>)}</div>
            <div style={{fontSize:11,color:C.gray,marginTop:4}}>{needsDual?"Needs Treasury Manager + CFO":"Needs Treasury Manager only"}</div>
            {stage==="draft"&&user==="riya"&&<Btn onClick={submit} bg={C.blue} style={{width:"100%",justifyContent:"center",marginTop:12}}>Submit for approval</Btn>}
            {(stage==="rejected"||stage==="settled")&&<Btn onClick={reset} outline style={{width:"100%",justifyContent:"center",marginTop:12}}>New request</Btn>}
          </div>
          <div style={s.card}><div style={s.eyebrow}>Thresholds</div><table style={{width:"100%",borderCollapse:"collapse",fontSize:12,marginTop:8}}><thead><tr>{["Amount","Approvals","Approvers"].map(h=><th key={h} style={{background:"var(--color-background-secondary)",padding:"5px 8px",textAlign:"left",fontWeight:500,borderBottom:"0.5px solid var(--color-border-secondary)"}}>{h}</th>)}</tr></thead><tbody>{[["< $100K","1","Treasury Manager",usdAmt<100000],["$100K-$500K","1","Mgr or CFO",usdAmt>=100000&&usdAmt<500000],["> $500K","2","Mgr + CFO",usdAmt>=500000]].map(([r,a,p,hl])=><tr key={r} style={{background:hl?C.blueLt:"transparent"}}>{[r,a,p].map((v,j)=><td key={j} style={{padding:"6px 8px",borderBottom:"0.5px solid var(--color-border-tertiary)",fontWeight:j===1&&hl?600:400}}>{v}</td>)}</tr>)}</tbody></table></div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={s.card}>
            <div style={s.eyebrow}>Approval status</div>
            {[{slot:1,name:"Approval 1 - Treasury Manager",who:"Approver 1",ap:approvals.david},{slot:2,name:"Approval 2 - CFO"+(needsDual?"":" (not required)"),who:"Approver 2",ap:approvals.priya}].map(a=><div key={a.slot} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:6,border:"0.5px solid var(--color-border-tertiary)",background:"var(--color-background-secondary)",marginBottom:8}}><div style={{width:32,height:32,borderRadius:"50%",background:a.ap==="approved"?C.tealLt:a.ap==="rejected"?C.redLt:"var(--color-background-secondary)",border:"1.5px "+(a.ap?"solid":"dashed")+" "+(a.ap==="approved"?C.teal:a.ap==="rejected"?C.red:"var(--color-border-secondary)"),display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:a.ap==="approved"?C.teal:a.ap==="rejected"?C.red:C.gray}}>{a.ap==="approved"?"V":a.ap==="rejected"?"X":a.slot}</div><div style={{flex:1}}><div style={{fontSize:13,fontWeight:500}}>{a.name}</div><div style={{fontSize:11,color:C.gray}}>{a.ap?(a.ap==="approved"?"Approved":"Rejected")+" by "+a.who:"Waiting for "+a.who}</div></div><Badge bg={a.ap==="approved"?C.tealLt:a.ap==="rejected"?C.redLt:"var(--color-background-secondary)"} color={a.ap==="approved"?C.teal:a.ap==="rejected"?C.red:C.gray}>{a.ap==="approved"?"Approved":a.ap==="rejected"?"Rejected":needsDual||a.slot===1?"Pending":"N/A"}</Badge></div>)}
            {canApprove&&<div style={{border:"1px solid "+C.green,borderRadius:8,padding:"1rem",marginTop:8}}><div style={{fontSize:12,fontWeight:600,color:C.green,marginBottom:8}}>{user==="david"?"Approver 1 - review transfer":"Approver 2 (CFO) - final approval"}</div><div style={{background:"var(--color-background-secondary)",borderRadius:6,padding:"10px",marginBottom:10,fontSize:12}}>{[["Amount",corridor==="us-in"?"$"+parseFloat(amount).toLocaleString():"Rs "+parseFloat(amount).toLocaleString()],["Purpose",purpose],["Notes",notes||"-"],["Approvals needed",needsDual?"2 (High value)":"1"]].map(([k,v])=><div key={k} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",borderBottom:"0.5px solid var(--color-border-tertiary)"}}><span style={{color:C.gray}}>{k}</span><span style={{fontWeight:500}}>{v}</span></div>)}</div><Field label="Comment (optional)"><Inp value={approverNote} onChange={setApproverNote} placeholder="Add a comment..."/></Field><div style={{display:"flex",gap:8}}><Btn onClick={approve} bg={C.green}>Approve</Btn><Btn onClick={reject} bg={C.red}>Reject</Btn></div></div>}
            {user==="riya"&&stage!=="draft"&&<div style={{padding:"10px",background:"var(--color-background-secondary)",borderRadius:6,marginTop:8,fontSize:12,color:C.gray}}>You are the maker - switch to David or Priya to approve</div>}
            {stage==="approved2"&&<div style={{padding:12,background:C.tealLt,border:"1px solid "+C.teal,borderRadius:8,marginTop:12}}><div style={{fontSize:12,fontWeight:600,color:C.teal,marginBottom:8}}>All approvals received</div><Btn onClick={execute} bg={C.green}>Execute via MMCoin Labs</Btn></div>}
            {stage==="executing"&&<div style={{padding:12,background:C.amberLt,borderRadius:8,marginTop:12,fontSize:13,color:C.amber}}>Sending to MMCoin Labs...</div>}
            {stage==="settled"&&<div style={{padding:12,background:C.greenLt,border:"1px solid "+C.green,borderRadius:8,marginTop:12}}><div style={{fontSize:13,fontWeight:600,color:C.green}}>Transfer settled</div><div style={{fontSize:12,color:C.gray,marginTop:4}}>MMCoin minted, transferred, burned. Client credited.</div></div>}
            {stage==="rejected"&&<div style={{padding:12,background:C.redLt,border:"1px solid "+C.red,borderRadius:8,marginTop:12}}><div style={{fontSize:13,fontWeight:600,color:C.red}}>Transfer rejected</div><div style={{fontSize:12,color:C.gray,marginTop:4}}>Maker notified.</div></div>}
          </div>
          <div style={s.card}><div style={s.eyebrow}>Audit trail</div><div style={{maxHeight:220,overflowY:"auto",marginTop:8}}>{audit.length===0?<div style={{fontSize:12,color:C.gray,textAlign:"center",padding:12}}>No activity yet</div>:audit.map((e,i)=><AuditEntry key={i} dot={e.color} msg={e.msg} who={e.who} time={e.time}/>)}</div></div>
        </div>
      </div>
    </div>
  );
};

// ─── Reserve / Issuer Console ─────────────────────────────────────────────────
const ReserveModule=({txEvents,supply,reserve,txLog,ssRev,gfRev,onMint,onBurn})=>{
  const [mbAmt,setMbAmt]=useState("");
  const ratio=supply>0?(reserve/supply)*100:0;
  const doMint=()=>{const a=parseFloat(mbAmt)||0;if(!a) return;onMint(a,"Operator console","Manual mint");setMbAmt("");};
  const doBurn=()=>{const a=parseFloat(mbAmt)||0;if(!a) return;if(a>supply){alert("Insufficient supply: "+supply.toFixed(2)+" MMC");return;}onBurn(a,"Operator console","Manual burn");setMbAmt("");};

  // Rich tx log renderer — shows fee breakdown per entry
  const TxRow=({e})=>{
    const [open,setOpen]=useState(false);
    const isMint=e.type==="mint", isBurn=e.type==="burn", isAudit=e.type==="audit";
    const bg=isMint?C.tealLt:isBurn?C.coralLt:isAudit?"var(--color-background-secondary)":e.provider==="SwiftSend"?C.blueLt:e.provider==="GlobalFirst"?C.purpleLt:C.amberLt;
    const ac=isMint?C.teal:isBurn?C.coral:isAudit?C.gray:e.provider==="SwiftSend"?C.blue:e.provider==="GlobalFirst"?C.purple:C.amber;
    const hasDetail=!isAudit&&!isMint&&!isBurn&&e.gross!=null;
    return (
      <div style={{background:bg,borderRadius:6,padding:"8px 10px",marginBottom:6,fontSize:12,border:"0.5px solid "+ac+"44"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,cursor:hasDetail?"pointer":"default"}} onClick={()=>hasDetail&&setOpen(o=>!o)}>
          <div style={{fontSize:15}}>{isMint?"⬆":isBurn?"⬇":e.provider==="SwiftSend"?"S":e.provider==="GlobalFirst"?"B":"R"}</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:500,color:ac}}>{e.label}</div>
            <div style={{fontSize:11,color:C.gray}}>{e.who} - {e.time}</div>
          </div>
          {(isMint||isBurn)&&<div style={{fontWeight:600,color:ac}}>{e.amt}</div>}
          {hasDetail&&<div style={{textAlign:"right"}}>
            <div style={{fontWeight:600,color:C.teal}}>{e.mmcMinted?.toFixed(2)} MMC minted</div>
            <div style={{fontSize:11,color:C.gray}}>Gross: ${e.gross?.toFixed(2)} {open?"▲":"▼ details"}</div>
          </div>}
          {isAudit&&<Badge bg="var(--color-background-secondary)" color={C.gray} style={{fontSize:10}}>audit</Badge>}
        </div>
        {hasDetail&&open&&(
          <div style={{marginTop:8,paddingTop:8,borderTop:"0.5px solid "+ac+"44"}}>
            <div style={{fontSize:11,fontWeight:600,color:C.gray,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.05em"}}>Why MMC minted ({e.mmcMinted?.toFixed(2)}) is less than gross (${e.gross?.toFixed(2)})</div>
            {[
              ["Gross USD into MMCoin Labs reserve","$"+e.gross?.toFixed(2),C.blueDk],
              [e.provider==="SwiftSend"?"SwiftSend service fee (0.5%)":"GlobalFirst service fee (0.15% + spread)","- $"+e.fiFee?.toFixed(2),e.provider==="SwiftSend"?C.blue:C.purple],
              ["MMCoin Labs fee ("+(e.provider==="SwiftSend"?"0.1%":"0.05%")+")","- $"+e.mmFee?.toFixed(2),C.amber],
              ["Net USD held in reserve = MMC minted","$"+e.mmcMinted?.toFixed(2)+"  =  "+e.mmcMinted?.toFixed(2)+" MMC",C.teal],
            ].map(([k,v,c])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",borderBottom:"0.5px solid "+ac+"22",fontSize:12}}>
                <span style={{color:C.gray}}>{k}</span><span style={{fontWeight:500,color:c}}>{v}</span>
              </div>
            ))}
            <div style={{marginTop:6,fontSize:11,color:C.amber,lineHeight:1.5}}>
              MMCoin Labs maintains a 1:1 reserve. Fees are deducted before minting so every MMC in circulation is backed by exactly $1 of custodied USD.
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:C.amberLt,borderRadius:6,border:"0.5px solid "+C.amber,marginBottom:"1.25rem"}}>
        <div style={{width:32,height:32,background:C.amber,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:16}}>M</div>
        <div><div style={{fontSize:13,fontWeight:500,color:C.amber}}>MMCoin Labs - Issuer and Reserve Console</div><div style={{fontSize:11,color:C.gray}}>Click any transaction row to see the full fee breakdown and why MMC minted differs from transfer amount</div></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:"1.25rem"}}>
        {[["Total MMC in circulation",supply.toFixed(2)+" MMC",C.teal],["USD in reserve (custodian)","$"+reserve.toLocaleString("en-US",{minimumFractionDigits:2}),C.blue],["Collateral ratio",supply>0?ratio.toFixed(1)+"%":"No supply yet",ratio>=100?C.green:ratio>0?C.red:C.gray]].map(([l,v,c])=>(
          <div key={l} style={{background:"var(--color-background-secondary)",borderRadius:8,padding:"12px 14px"}}><div style={{fontSize:11,color:C.gray,marginBottom:4}}>{l}</div><div style={{fontSize:18,fontWeight:500,color:c}}>{v}</div></div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={s.card}>
            <div style={s.eyebrow}>Operator mint / burn</div>
            <div style={{fontSize:13,color:C.gray,marginBottom:12}}>Enter an amount and click Mint or Burn. MMCoin Labs mints only against actual USD in reserve.</div>
            <Field label="Amount (USD equivalent)"><Inp value={mbAmt} onChange={setMbAmt} type="number" placeholder="e.g. 10000"/></Field>
            <div style={{display:"flex",gap:10}}>
              <Btn onClick={doMint} bg={C.teal} style={{flex:1,justifyContent:"center",fontSize:14}}>Mint MMC</Btn>
              <Btn onClick={doBurn} bg={C.coral} style={{flex:1,justifyContent:"center",fontSize:14}}>Burn MMC</Btn>
            </div>
            {supply===0&&<div style={{marginTop:12,padding:"10px 12px",background:C.amberLt,borderRadius:6,fontSize:12,color:C.amber}}>Enter an amount above and click Mint MMC to add tokens to the reserve.</div>}
          </div>
          <div style={s.card}>
            <div style={s.eyebrow}>Reserve health</div>
            <div style={{height:10,borderRadius:5,background:"var(--color-background-secondary)",overflow:"hidden",margin:"8px 0 4px"}}>
              <div style={{height:"100%",borderRadius:5,width:Math.min(ratio,150)+"%",background:ratio>=100?C.teal:ratio>0?C.red:"transparent",transition:"width .4s"}}/>
            </div>
            <div style={{fontSize:12,color:C.gray,marginBottom:12}}>{supply>0?ratio.toFixed(1)+"% backed (target 100%+)":"No MMC in circulation yet"}</div>
            <div style={s.divider}/>
            <div style={s.eyebrow}>Proof of reserve</div>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,marginTop:6}}>
              <thead><tr>{["Asset","Amount","Custodian"].map(h=><th key={h} style={{background:"var(--color-background-secondary)",padding:"5px 8px",textAlign:"left",fontWeight:500,borderBottom:"0.5px solid var(--color-border-secondary)"}}>{h}</th>)}</tr></thead>
              <tbody>{[["USD held","$"+reserve.toFixed(2),"Custodian Bank"],["MMC issued",supply.toFixed(2)+" MMC","On-ledger"],["Ratio",supply>0?ratio.toFixed(1)+"%":"-","Auto-verified"]].map(([a,b,c])=><tr key={a}><td style={{padding:"5px 8px",borderBottom:"0.5px solid var(--color-border-tertiary)"}}>{a}</td><td style={{padding:"5px 8px",borderBottom:"0.5px solid var(--color-border-tertiary)",fontWeight:500}}>{b}</td><td style={{padding:"5px 8px",fontSize:11,color:C.gray,borderBottom:"0.5px solid var(--color-border-tertiary)"}}>{c}</td></tr>)}</tbody>
            </table>
            <div style={s.divider}/>
            <div style={s.eyebrow}>MMCoin Labs fee revenue</div>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,marginTop:6}}>
              <thead><tr>{["From","Rate","Earned"].map(h=><th key={h} style={{background:"var(--color-background-secondary)",padding:"5px 8px",textAlign:"left",fontWeight:500,borderBottom:"0.5px solid var(--color-border-secondary)"}}>{h}</th>)}</tr></thead>
              <tbody>
                <tr><td style={{padding:"5px 8px",borderBottom:"0.5px solid var(--color-border-tertiary)"}}><Badge bg={C.blueLt} color={C.blue}>SwiftSend</Badge></td><td style={{padding:"5px 8px",borderBottom:"0.5px solid var(--color-border-tertiary)"}}>0.1%</td><td style={{padding:"5px 8px",borderBottom:"0.5px solid var(--color-border-tertiary)",color:C.green,fontWeight:500}}>${ssRev.toFixed(2)}</td></tr>
                <tr><td style={{padding:"5px 8px",borderBottom:"0.5px solid var(--color-border-tertiary)"}}><Badge bg={C.purpleLt} color={C.purple}>GlobalFirst</Badge></td><td style={{padding:"5px 8px",borderBottom:"0.5px solid var(--color-border-tertiary)"}}>0.05%</td><td style={{padding:"5px 8px",borderBottom:"0.5px solid var(--color-border-tertiary)",color:C.green,fontWeight:500}}>${gfRev.toFixed(2)}</td></tr>
                <tr><td style={{padding:"5px 8px",fontWeight:500}} colSpan={2}>Total</td><td style={{padding:"5px 8px",color:C.green,fontWeight:500}}>${(ssRev+gfRev).toFixed(2)}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div style={s.card}>
          <div style={s.eyebrow}>Transaction log <span style={{fontSize:10,fontWeight:400,color:C.gray}}>— click a row to see fee breakdown</span></div>
          <div style={{maxHeight:560,overflowY:"auto",marginTop:8}}>
            {txEvents.length===0&&txLog.length===0
              ?<div style={{fontSize:12,color:C.gray,textAlign:"center",padding:24,lineHeight:1.8}}>No transactions yet.<br/>Enter an amount and click Mint MMC above,<br/>or visit other tabs to generate activity.</div>
              :[...txLog,...txEvents].map((e,i)=><TxRow key={i} e={e}/>)
            }
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Root App ─────────────────────────────────────────────────────────────────
const TABS=[{id:"kyc",label:"KYC / Compliance"},{id:"retail",label:"Retail remittance"},{id:"b2b",label:"B2B treasury"},{id:"approval",label:"Dual approval"},{id:"reserve",label:"Issuer console"}];

export default function App() {
  const [tab,setTab]=useState("kyc");
  const [fxRate,setFxRate]=useState(FX_DEFAULT);

  // All reserve state lives in App — never lost on tab switch
  const [supply,setSupply]=useState(0);
  const [reserve,setReserve]=useState(0);
  const [txLog,setTxLog]=useState([]);      // manual mint/burn entries
  const [txEvents,setTxEvents]=useState([]); // rich structured events from all modules
  const [ssRev,setSsRev]=useState(0);
  const [gfRev,setGfRev]=useState(0);

  const nt=()=>new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"});

  // Called by RetailModule and B2BModule and ApprovalModule with structured data
  const addTxEvent=useCallback((ev)=>{
    const time=ev.time||nt();
    const entry={...ev,time};
    setTxEvents(prev=>[entry,...prev].slice(0,100));
    // Update supply/reserve/revenue for non-audit events
    if(ev.type==="retail"||ev.type==="b2b"){
      const net=ev.mmcMinted||0;
      // Mint phase
      setSupply(s=>s+net);
      setReserve(r=>r+net);
      // Track MMCoin Labs fee revenue per service provider
      if(ev.provider==="SwiftSend") setSsRev(prev=>prev+(ev.mmFee||0));
      if(ev.provider==="GlobalFirst") setGfRev(prev=>prev+(ev.mmFee||0));
      // Burn phase (same amount — on-ledger transfer then immediate burn)
      setTimeout(()=>{
        setSupply(s=>Math.max(0,s-net));
        setReserve(r=>Math.max(0,r-net));
      },100);
    }
  },[setSsRev,setGfRev]);

  // Manual mint/burn from operator console
  const handleMint=useCallback((a,prov,label)=>{
    setSupply(s=>s+a);setReserve(r=>r+a);
    setTxLog(prev=>[{icon:"U",label,sub:prov,amt:"+"+a.toFixed(2)+" MMC",type:"mint",time:nt()},...prev]);
  },[]);
  const handleBurn=useCallback((a,prov,label)=>{
    setSupply(s=>Math.max(0,s-a));setReserve(r=>Math.max(0,r-a));
    setTxLog(prev=>[{icon:"D",label,sub:prov,amt:"-"+a.toFixed(2)+" MMC",type:"burn",time:nt()},...prev]);
  },[]);

  return (
    <div style={{padding:"1.25rem",fontFamily:"system-ui,sans-serif",color:"var(--color-text-primary)",minHeight:"100vh"}}>
      <div style={{marginBottom:"1.25rem"}}><div style={{fontSize:22,fontWeight:500,marginBottom:4}}>MMCoin ecosystem demo</div><div style={{fontSize:13,color:C.gray}}>MMCoin Labs - SwiftSend - GlobalFirst Bank - Full stablecoin lifecycle</div></div>
      <EntityBanner fxRate={fxRate} setFxRate={setFxRate}/>
      <div style={{display:"flex",borderBottom:"0.5px solid var(--color-border-secondary)",marginBottom:"1.5rem",overflowX:"auto"}}>
        {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"9px 16px",fontSize:13,fontWeight:500,cursor:"pointer",border:"none",borderBottom:"2px solid "+(tab===t.id?C.blue:"transparent"),background:"transparent",color:tab===t.id?C.blue:"var(--color-text-secondary)",whiteSpace:"nowrap"}}>{t.label}</button>)}
      </div>
      <div style={{display:tab==="kyc"?"block":"none"}}><KYCModule addTxEvent={addTxEvent}/></div>
      <div style={{display:tab==="retail"?"block":"none"}}><RetailModule fxRate={fxRate} addTxEvent={addTxEvent}/></div>
      <div style={{display:tab==="b2b"?"block":"none"}}><B2BModule fxRate={fxRate} addTxEvent={addTxEvent}/></div>
      <div style={{display:tab==="approval"?"block":"none"}}><ApprovalModule fxRate={fxRate} addTxEvent={addTxEvent}/></div>
      <div style={{display:tab==="reserve"?"block":"none"}}>
        <ReserveModule txEvents={txEvents} supply={supply} reserve={reserve} txLog={txLog} ssRev={ssRev} gfRev={gfRev} onMint={handleMint} onBurn={handleBurn}/>
      </div>
    </div>
  );
}

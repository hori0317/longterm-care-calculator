/**********************
 * script.js（完整版｜全服務＋最終穩定版）
 * - 含所有 BA / BD / C / GA / SC 服務項目
 * - 所有碼別都以 data-use 為最終計算依據
 * - 防止金額倍增與總次數覆蓋
 **********************/

/* ---------- 數字清洗 ---------- */
function toInt(v){
  if (typeof v === "number") return Number.isFinite(v) ? Math.trunc(v) : 0;
  if (v === null || v === undefined) return 0;
  const fw={'０':'0','１':'1','２':'2','３':'3','４':'4','５':'5','６':'6','７':'7','８':'8','９':'9','，':',','．':'.'};
  let s=String(v).replace(/[０-９，．]/g,ch=>fw[ch]??ch);
  s=s.replace(/,/g,'').trim();
  const m=s.match(/^[+-]?\d+/);
  return m?parseInt(m[0],10):0;
}

/* ---------- 服務資料 ---------- */
const serviceData={
  BA:[
    {code:"BA01",name:"基本身體清潔",price:260},
    {code:"BA02",name:"基本日常照顧",price:195},
    {code:"BA03",name:"測量生命徵象",price:35},
    {code:"BA04",name:"協助進食或管灌",price:130},
    {code:"BA05",name:"餐食照顧",price:310},
    {code:"BA07",name:"協助沐浴及洗頭",price:325},
    {code:"BA08",name:"足部照護",price:500},
    {code:"BA09",name:"到宅沐浴-1",price:2200},
    {code:"BA09a",name:"到宅沐浴-2",price:2500},
    {code:"BA10",name:"翻身拍背",price:155},
    {code:"BA11",name:"肢體關節活動",price:195},
    {code:"BA12",name:"協助上下樓梯",price:130},
    {code:"BA13",name:"陪同外出",price:195},
    {code:"BA14",name:"陪同就醫",price:685},
    {code:"BA15",name:"家務協助",price:195},
    {code:"BA16",name:"代購",price:130},
    {code:"BA17a",name:"人工氣道管抽吸",price:75},
    {code:"BA17b",name:"口腔內抽吸",price:65},
    {code:"BA17c",name:"管路清潔",price:50},
    {code:"BA17d",name:"通便/驗血糖",price:50},
    {code:"BA17e",name:"依指示置入藥盒",price:50},
    {code:"BA18",name:"安全看視",price:200},
    {code:"BA20",name:"陪伴服務",price:175},
    {code:"BA22",name:"巡視服務",price:130},
    {code:"BA23",name:"協助洗頭",price:200},
    {code:"BA24",name:"協助排泄",price:220},
  ],
  BD:[
    {code:"BD01",name:"社區式協助沐浴",price:200},
    {code:"BD02",name:"社區式晚餐",price:150},
    {code:"BD03",name:"社區式服務交通接送",price:115},
  ],
  C:[
    {code:"CA07",name:"IADLs/ADLs 復能照護(3次含評估)",price:4500},
    {code:"CA08",name:"ISP擬定與執行(4次含評估)",price:6000},
    {code:"CB01",name:"營養照護(3次含評估)",price:6000},
    {code:"CB02",name:"進食與吞嚥照護(6次含評估)",price:9000},
    {code:"CB03",name:"困擾行為照護(3次含評估)",price:4500},
    {code:"CB04",name:"臥床/長期活動受限照護(6次含評估)",price:9000},
    {code:"CC01",name:"居家環境安全或無障礙空間規劃",price:2000},
    {code:"CD02",name:"居家護理指導與諮詢(3次+1次評估)",price:6000},
  ],
  GA:[{code:"GA09",name:"喘息 2 小時/支",price:770}],
  SC:[{code:"SC09",name:"短照 2 小時/支",price:770}],
};

/* ---------- 額度 ---------- */
const cmsQuota={2:10020,3:15460,4:18580,5:24100,6:28070,7:32090,8:36180};
const GA_CAP={2:32340,3:32340,4:32340,5:32340,6:32340,7:48510,8:48510};
const SC_CAP={2:87780,3:87780,4:87780,5:87780,6:87780,7:71610,8:71610};

/* ---------- 其他 ---------- */
const WEEKS_PER_MONTH=4.5;
const $=s=>document.querySelector(s);

/* ---------- 初始化 ---------- */
document.addEventListener("DOMContentLoaded",()=>{
  renderTables();
  updateResults();
});

/* ---------- 表格生成 ---------- */
function renderTables(){
  const container=$("#tables");
  container.innerHTML="";
  Object.keys(serviceData).forEach(code=>{
    const h3=document.createElement("h3");
    h3.textContent=`${code} 碼`;
    container.appendChild(h3);

    const table=document.createElement("table");
    table.innerHTML=`<thead><tr>
      <th style="min-width:240px">服務項目</th>
      <th>單價</th>
      <th>週次</th>
      <th>月次</th>
      <th>總次</th>
      <th>金額</th>
    </tr></thead><tbody></tbody>`;
    const tbody=table.querySelector("tbody");

    serviceData[code].forEach((item,i)=>{
      const tr=document.createElement("tr");
      tr.dataset.manual="0";
      tr.dataset.use="0";
      tr.innerHTML=`
        <td>${item.code} ${item.name}</td>
        <td>${item.price}</td>
        <td><input class="inp-week" type="number" value="0" min="0"></td>
        <td><input class="inp-month" type="number" value="0" readonly></td>
        <td><input class="inp-total" type="number" value="0" min="0"></td>
        <td class="cell-amount">0</td>`;
      const week=tr.querySelector(".inp-week");
      const month=tr.querySelector(".inp-month");
      const total=tr.querySelector(".inp-total");

      // 週次事件
      const onWeek=()=>{
        const w=toInt(week.value);
        const m=Math.ceil(w*WEEKS_PER_MONTH);
        month.value=m;
        if(tr.dataset.manual==="0"){
          total.value=m;
          tr.dataset.use=m;
        }
        updateOneRow(code,i);
      };
      week.addEventListener("input",onWeek);
      week.addEventListener("change",onWeek);

      // 總次事件
      const onTotal=()=>{
        tr.dataset.manual="1";
        tr.dataset.use=toInt(total.value);
        updateOneRow(code,i);
      };
      total.addEventListener("input",onTotal);
      total.addEventListener("change",onTotal);

      tbody.appendChild(tr);
    });

    container.appendChild(table);
  });
}

/* ---------- 單列金額 ---------- */
function updateOneRow(code,idx){
  const tIndex=Object.keys(serviceData).indexOf(code);
  const table=document.querySelectorAll("#tables table")[tIndex];
  const tr=table.tBodies[0].rows[idx];
  const price=serviceData[code][idx].price;
  const use=toInt(tr.dataset.use);
  tr.querySelector(".cell-amount").textContent=(price*use).toLocaleString();
  updateResults();
}

/* ---------- 統計 ---------- */
function updateResults(){
  let sumBA=0,sumGA=0,sumSC=0;
  Object.keys(serviceData).forEach(code=>{
    const table=document.querySelectorAll("#tables table")[Object.keys(serviceData).indexOf(code)];
    const tbody=table.tBodies[0];
    [...tbody.rows].forEach((tr,i)=>{
      const price=serviceData[code][i].price;
      let use=toInt(tr.dataset.use);
      // 若尚未建立 data-use，使用週→月推算（不覆蓋）
      if(!use){
        const w=toInt(tr.querySelector(".inp-week").value);
        const m=Math.ceil(w*WEEKS_PER_MONTH);
        if(m>0) tr.dataset.use=m;
        use=m;
      }
      const amt=price*use;
      tr.querySelector(".cell-amount").textContent=amt.toLocaleString();
      if(code==="GA") sumGA+=amt;
      else if(code==="SC") sumSC+=amt;
      else sumBA+=amt;
    });
  });
  const cms=Number((document.querySelector("input[name='cms']:checked")||{}).value)||2;
  const grantBA=cmsQuota[cms]||0;
  const remainBA=Math.max(0,grantBA-sumBA);
  $("#sumGrantBA")&&($("#sumGrantBA").textContent=grantBA.toLocaleString());
  $("#sumRemainBA")&&($("#sumRemainBA").textContent=remainBA.toLocaleString());
  $("#sumRemainBA_foot")&&($("#sumRemainBA_foot").textContent=remainBA.toLocaleString());
}

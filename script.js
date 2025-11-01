/**********************
 * script.js（最終穩定版｜全碼修正）
 * 完全防止總金額倍增與覆蓋
 **********************/

function toInt(v){
  if (typeof v === "number") return Number.isFinite(v) ? Math.trunc(v) : 0;
  if (v === null || v === undefined) return 0;
  const fw = {'０':'0','１':'1','２':'2','３':'3','４':'4','５':'5','６':'6','７':'7','８':'8','９':'9','，':',','．':'.'};
  let s = String(v).replace(/[０-９，．]/g, ch => fw[ch] ?? ch);
  s = s.replace(/,/g, '').trim();
  const m = s.match(/^[+-]?\d+/);
  return m ? parseInt(m[0], 10) : 0;
}

const serviceData = {
  BA: [
    { code: "BA01", name: "基本身體清潔", price: 260 },
    { code: "BA02", name: "基本日常照顧", price: 195 },
    { code: "BA03", name: "測量生命徵象", price: 35 },
    { code: "BA04", name: "協助進食或管灌", price: 130 },
    { code: "BA05", name: "餐食照顧", price: 310 },
    { code: "BA07", name: "協助沐浴及洗頭", price: 325 },
    { code: "BA17a", name: "人工氣道管抽吸", price: 75 },
    { code: "BA20", name: "陪伴服務", price: 175 },
    { code: "BA23", name: "協助洗頭", price: 200 },
  ],
  GA: [{ code: "GA09", name: "喘息 2 小時/支", price: 770 }],
  SC: [{ code: "SC09", name: "短照 2 小時/支", price: 770 }],
};
const cmsQuota = {2:10020,3:15460,4:18580,5:24100,6:28070,7:32090,8:36180};
const GA_CAP={2:32340,3:32340,4:32340,5:32340,6:32340,7:48510,8:48510};
const SC_CAP={2:87780,3:87780,4:87780,5:87780,6:87780,7:71610,8:71610};
const WEEKS_PER_MONTH=4.5;
const $ = s=>document.querySelector(s);

document.addEventListener("DOMContentLoaded",()=>{
  renderTables();
  bindHeaderInputs();
  updateResults();
});

function renderTables(){
  const container=$("#tables");
  container.innerHTML="";
  Object.keys(serviceData).forEach(code=>{
    const h3=document.createElement("h3");
    h3.textContent=`${code} 碼`;
    container.appendChild(h3);
    const table=document.createElement("table");
    table.innerHTML=`<thead><tr><th>項目</th><th>單價</th><th>週次</th><th>月次</th><th>總次</th><th>金額</th></tr></thead><tbody></tbody>`;
    const tbody=table.querySelector("tbody");
    serviceData[code].forEach((item,i)=>{
      const tr=document.createElement("tr");
      tr.dataset.manual="0";
      tr.dataset.use="0";
      tr.innerHTML=`
        <td>${item.code} ${item.name}</td>
        <td>${item.price}</td>
        <td><input class="inp-week" type="number" value="0" min="0"/></td>
        <td><input class="inp-month" type="number" value="0" readonly/></td>
        <td><input class="inp-total" type="number" value="0" min="0"/></td>
        <td class="cell-amount">0</td>`;
      const week=tr.querySelector(".inp-week");
      const month=tr.querySelector(".inp-month");
      const total=tr.querySelector(".inp-total");

      const recalcWeek=()=>{
        const w=toInt(week.value);
        const m=Math.ceil(w*WEEKS_PER_MONTH);
        month.value=m;
        if(tr.dataset.manual==="0"){
          total.value=m;
          tr.dataset.use=m;
        }
        updateOneRow(code,i);
      };
      const recalcTotal=()=>{
        tr.dataset.manual="1";
        tr.dataset.use=toInt(total.value);
        updateOneRow(code,i);
      };
      week.addEventListener("input",recalcWeek);
      week.addEventListener("change",recalcWeek);
      total.addEventListener("input",recalcTotal);
      total.addEventListener("change",recalcTotal);

      tbody.appendChild(tr);
    });
    container.appendChild(table);
  });
}

function updateOneRow(code,idx){
  const table=document.querySelectorAll("#tables table")[Object.keys(serviceData).indexOf(code)];
  const tr=table.tBodies[0].rows[idx];
  const price=serviceData[code][idx].price;
  const use=toInt(tr.dataset.use);
  tr.querySelector(".cell-amount").textContent=(price*use).toLocaleString();
  updateResults();
}

function bindHeaderInputs(){
  document.querySelectorAll("input[name='cms']").forEach(e=>e.addEventListener("change",updateResults));
}

function updateResults(){
  let sumBA=0,sumGA=0,sumSC=0;
  Object.keys(serviceData).forEach(code=>{
    const table=document.querySelectorAll("#tables table")[Object.keys(serviceData).indexOf(code)];
    const tbody=table.tBodies[0];
    [...tbody.rows].forEach((tr,i)=>{
      const price=serviceData[code][i].price;
      let use=toInt(tr.dataset.use);
      if(!use){ // 若從未輸入過，週→月初始
        const w=toInt(tr.querySelector(".inp-week").value);
        const m=Math.ceil(w*WEEKS_PER_MONTH);
        tr.dataset.use=m;
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
  const grantBA=cmsQuota[cms];
  const remainBA=grantBA-sumBA;
  $("#sumGrantBA")&&($("#sumGrantBA").textContent=grantBA.toLocaleString());
  $("#sumRemainBA")&&($("#sumRemainBA").textContent=Math.max(0,remainBA).toLocaleString());
}

const items=JSON.parse(localStorage.getItem("secpack-cart")||"[]").filter(item=>item&&typeof item.id==="string"&&Number.isInteger(item.qty)&&item.qty>0).map(item=>({id:item.id,qty:item.qty}));
const productNames={paper:"product.name.paper",film:"product.name.film",adhesive:"product.name.adhesive",packaging:"product.name.packaging"};
const t=()=>window.secpackT||((key)=>key);
function save(){localStorage.setItem("secpack-cart",JSON.stringify(items));render()}
function addToCart(id){if(!productNames[id])return;const x=items.find(i=>i.id===id);if(x)x.qty++;else items.push({id,qty:1});save();document.getElementById("orderPanel")?.classList.add("open")}
function changeQty(id,delta){const x=items.find(i=>i.id===id);if(!x)return;x.qty+=delta;if(x.qty<1)items.splice(items.indexOf(x),1);save()}
function render(){
  const translate=t();
  const count=document.getElementById("cartCount");
  const rows=document.getElementById("cartRows");
  if(count)count.textContent=String(items.reduce((sum,item)=>sum+item.qty,0));
  if(!rows)return;
  rows.replaceChildren();
  if(!items.length){const empty=document.createElement("p");empty.textContent=translate("dynamic.cartEmpty");rows.appendChild(empty);return;}
  items.forEach(item=>{
    const row=document.createElement("div");row.className="cart-row";
    const strong=document.createElement("strong");strong.textContent=translate(productNames[item.id]);
    const controls=document.createElement("span");controls.className="qty";
    const minus=document.createElement("button");minus.type="button";minus.dataset.qtyChange="-1";minus.dataset.itemId=item.id;minus.title=translate("dynamic.decrease");minus.setAttribute("aria-label",translate("dynamic.decrease"));minus.textContent="−";
    const qty=document.createElement("span");qty.textContent=String(item.qty);
    const plus=document.createElement("button");plus.type="button";plus.dataset.qtyChange="1";plus.dataset.itemId=item.id;plus.title=translate("dynamic.increase");plus.setAttribute("aria-label",translate("dynamic.increase"));plus.textContent="+";
    controls.append(minus,qty,plus);row.append(strong,controls);rows.appendChild(row);
  });
}
function toggleCart(){document.getElementById("orderPanel")?.classList.toggle("open");render()}
async function prepareOrder(){
  if(!items.length){alert(t()("dynamic.addProduct"));return;}
  const status=document.getElementById("orderResult");
  const data={name:document.getElementById("customerName").value,email:document.getElementById("customerEmail").value,phone:document.getElementById("customerPhone").value,destination:document.getElementById("destination").value,payment:document.getElementById("payment").value,notes:document.getElementById("notes").value,items};
  const result=await window.secpackSubmitOrder(data,status,null);
  const box=document.createElement("div");box.className="quote";
  const strong=document.createElement("strong");strong.textContent=t()("dynamic.orderPrepared");
  const p1=document.createElement("p");p1.textContent=t()("dynamic.orderDraft");
  const p2=document.createElement("p");p2.className="form-status";if(result.ok)p2.classList.add("success");p2.textContent=t()(result.ok?"dynamic.formSent":(result.configured?"dynamic.formError":"dynamic.formNotConfigured"));
  if(result.ok&&result.result?.orderNo){
    const p3=document.createElement("p");p3.className="form-status success";p3.textContent="Order reference: "+result.result.orderNo;
    box.append(strong,p1,p2,p3);status.replaceChildren(box);items.splice(0,items.length);save();return;
  }
  box.append(strong,p1,p2);status.replaceChildren(box);
}
document.addEventListener("click",(event)=>{
  const add=event.target.closest("[data-add-cart]");if(add)addToCart(add.dataset.addCart);
  const action=event.target.closest("[data-sec-action]")?.dataset.secAction;if(action==="cart-toggle")toggleCart();if(action==="prepare-order")prepareOrder();
  const qty=event.target.closest("[data-qty-change]");if(qty)changeQty(qty.dataset.itemId,Number(qty.dataset.qtyChange));
});
render();window.addEventListener("secpack:languagechange",render);

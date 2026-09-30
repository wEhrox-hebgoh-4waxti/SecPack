const items=[];
const productNames={paper:"product.name.paper",film:"product.name.film",adhesive:"product.name.adhesive",packaging:"product.name.packaging"};
const t=()=>window.secpackT||((key)=>key);
function addToCart(id){if(!productNames[id])return;const x=items.find(i=>i.id===id);if(x)x.qty++;else items.push({id,qty:1});render();document.getElementById("orderPanel")?.classList.add("open")}
function changeQty(id,delta){const x=items.find(i=>i.id===id);if(!x)return;x.qty+=delta;if(x.qty<1)items.splice(items.indexOf(x),1);render()}
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
    const qty=document.createElement("input");qty.type="number";qty.min="1";qty.max="100000";qty.step="1";qty.value=String(item.qty);qty.className="qty-input";qty.dataset.qtyInput=item.id;qty.setAttribute("aria-label",translate("dynamic.quantity"));controls.appendChild(qty);row.append(strong,controls);rows.appendChild(row);
  });
}
function toggleCart(){document.getElementById("orderPanel")?.classList.toggle("open");render()}
async function prepareOrder(){
  if(!items.length){alert(t()("dynamic.addProduct"));return;}
  const status=document.getElementById("orderResult");
  const data={name:document.getElementById("customerName").value,email:document.getElementById("customerEmail").value,phone:document.getElementById("customerPhone").value,destination:document.getElementById("destination").value,payment:document.getElementById("payment").value,notes:document.getElementById("notes").value,items:JSON.stringify(items)};
  const result=await window.secpackSubmitPayload(data,"order",status,null);
  const box=document.createElement("div");box.className="quote";
  const strong=document.createElement("strong");strong.textContent=t()("dynamic.orderPrepared");
  const p1=document.createElement("p");p1.textContent=t()("dynamic.orderDraft");
  const p2=document.createElement("p");p2.className="form-status";if(result.ok)p2.classList.add("success");p2.textContent=t()(result.ok?"dynamic.formSent":(result.configured?"dynamic.formError":"dynamic.formNotConfigured"));
  if(result.ok && result.result?.orderId){
    const ref=document.createElement("p");ref.className="order-reference";
    const labels={en:"Order reference",fa:"شماره پیگیری سفارش",ar:"مرجع الطلب"};
    ref.textContent=(labels[document.documentElement.lang]||labels.en)+": "+result.result.orderId;box.appendChild(ref);
  }
  box.append(strong,p1,p2);status.replaceChildren(box);
}
document.addEventListener("change",(event)=>{
  const qty=event.target.closest("[data-qty-input]");
  if(!qty)return;
  const item=items.find(i=>i.id===qty.dataset.qtyInput);
  const value=Number(qty.value);
  if(!item)return;
  if(!Number.isInteger(value)||value<1||value>100000){qty.value=String(item.qty);return;}
  item.qty=value;render();
});
document.addEventListener("click",(event)=>{
  const add=event.target.closest("[data-add-cart]");if(add)addToCart(add.dataset.addCart);
  const action=event.target.closest("[data-sec-action]")?.dataset.secAction;if(action==="cart-toggle")toggleCart();if(action==="prepare-order")prepareOrder();
  const qty=event.target.closest("[data-qty-change]");if(qty)changeQty(qty.dataset.itemId,Number(qty.dataset.qtyChange));
});
render();window.addEventListener("secpack:languagechange",render);

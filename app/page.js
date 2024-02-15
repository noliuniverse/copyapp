"use client";
import Image from "next/image";
import React, { useRef, useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [theme, setTheme] =  useState("a9a1ff")
  const [title, setTitle] =  useState("")
  const [desc, setDesc] =  useState("")
  const [warn, setwarn] = useState('None')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [removeTitle, setremoveTitle] = useState('')
  const [customID, setcustomID] = useState("id" + Math.random().toString(34).slice(6));
  const [added, setAdded] = useState(0);
  const [idS, setidS] = useState('')

  const [dropdownEnabled, setDropdownEnabled] = useState(false);
  const dropdown = useRef();
  function lines(text) {  
    return text.split('\n')
  }
  const exportData = async () => {
    console.log({"copies":JSON.parse(localStorage.getItem("copies")), "theme":localStorage.getItem("theme")})
    var res = window.btoa(encodeURIComponent(JSON.stringify({"copies":JSON.parse(localStorage.getItem("copies")), "theme":localStorage.getItem("theme")})));
    await navigator.clipboard.writeText(res)
    alert("Exported.")
  }
  const importData = async () => {
    let str = prompt("Enter your export:");
    var res2 = atob(str);
    if (String(str) !== "null") {
    try{
      str = Array.prototype.filter.call(str, n => n !== "\\").join("")
    let decoded = decodeURIComponent(window.atob(str))
    const object = JSON.parse(decoded)
      localStorage.setItem("copies", JSON.stringify(object["copies"]))
      localStorage.setItem("theme", object["theme"])
      window.location.href = window.location.href;
      
    } catch {
      alert("It didn't go through.")
    }}
  }
  const handleMassAdd = (descs) => {
    if ((descs == '')) {
      setwarn("Description is empty")
    } else {
    const linesList = lines(descs)
    var newList = []
    var newAdded = 0;
    for (let i = 0; i < linesList.length; i++) {
      newAdded = added+(i+1)
      var titles=customID + "-" + (newAdded);
        
      newList = [...newList, {"title":titles, "desc":linesList[i]}]
      
    }
    setAdded(newAdded+1)
    setData([...data, ...newList])
    localStorage.setItem("copies", JSON.stringify([...JSON.parse(localStorage.getItem("copies")), ...newList]))
    setTitle("");
      setDesc("");
    }
  }
  const handleAdd = (titles, descs) => {
    const checkTitle = obj => obj.title === titles;

    if (!data) {
      setwarn("There's something wrong with your data. Either it loaded wrong or you messed with it.")
    } else if ((descs == '')) {
      setwarn("Description is empty")
    } else if (data.some(checkTitle) == true) {
      setwarn("There's a copy with this same title.")
    }
    else {
      if (titles == '') {
        titles=customID + "-" + added;
        setAdded(added+1)
      }
      setData([...data, {"title":titles, "desc":descs}])
    localStorage.setItem("copies", JSON.stringify([...JSON.parse(localStorage.getItem("copies")), {"title":titles, "desc":descs}]))
      setTitle("");
      setDesc("");
      setwarn("None");
  }
  }
  const handleRemove = (titles) => {
    

    if (data[parseInt(titles)]) {
      const split = data.filter((obj) => obj !== data[parseInt(titles)])
      setData(split);
      localStorage.setItem("copies", JSON.stringify(split))

  
      

      setwarn("None");
    } else {
      setwarn("i not available!")
    }
  }

  const handleEdit = (titles, descs) => {
    
    if (idS == '' || idS == null){
      setwarn("i value is empty.");
      return
    }
    if (descs == ''){
      setwarn("Description is empty.");
      return
    }
    if (data[parseInt(titles)]) {
      const newIds = data.slice()
      const currentTitle = newIds[parseInt(titles)]["title"]
      newIds[parseInt(titles)] = {"title":currentTitle, "desc":descs}
      
      setData(newIds);
      localStorage.setItem("copies", JSON.stringify(newIds))
      setTitle("");
      setDesc("");

  
      

      setwarn("None");
    } else {
      setwarn("i not available!")
    }
  }
  var start = 0;
  const checkCopies = () => {
    if (localStorage.getItem("theme") == null) {
      localStorage.setItem("theme", "a9a1ff");
    
    }
    setTheme(localStorage.getItem("theme"))
    if (JSON.parse(localStorage.getItem("copies")) == null) {
      localStorage.setItem("copies", JSON.stringify([{"title":"Your first copy!", "desc": "Remove this by going to the settings, click the // next to 'CopyWeb' to go to settings. Scroll down to 'Remove (i):' and put 0."}, {"title":"Your second copy!", "desc": "Add a copy by going to settings and making a description (title optional), and pressing Add."}, {"title":"Your third copy!", "desc": "Use export and import to transfer all of your copies and theme. Mass add is mass adding copies seperated by new lines!"}]));
    
    }
    setData(JSON.parse(localStorage.getItem("copies")))
    
  }
  const newShade = (hexColor, magnitude) => {
    hexColor = hexColor.replace(`#`, ``);
    if (hexColor.length === 6) {
        const decimalColor = parseInt(hexColor, 16);
        let r = (decimalColor >> 16) + magnitude;
        r > 255 && (r = 255);
        r < 0 && (r = 0);
        let g = (decimalColor & 0x0000ff) + magnitude;
        g > 255 && (g = 255);
        g < 0 && (g = 0);
        let b = ((decimalColor >> 8) & 0x00ff) + magnitude;
        b > 255 && (b = 255);
        b < 0 && (b = 0);
        return `#${(g | (b << 8) | (r << 16)).toString(16)}`;
    } else {
        return hexColor;
    }
};

  const handleCopy = async (item) => {
    try {
      await navigator.clipboard.writeText(item);
      console.log('Copy copied to clipboard');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }

  const searchFilter = (array) => {
    return array.filter(
      (el) => el.title.toLowerCase().includes(search.toLowerCase())
    )
    }
   useEffect(()=>{
        start++
        if (start == 1){
          checkCopies()
          
          setLoading(false)
        }
    }, [])

    useEffect(() => {
      if (!dropdownEnabled) return;
      function handleClick(event) {
        if (dropdown.current && !dropdown.current.contains(event.target)) {
          setDropdownEnabled(false);
        }
      }
      document.addEventListener("click", handleClick);
      // clean up
      return () => document.removeEventListener("click", handleClick);
    }, [dropdownEnabled]);

   

  
  return (
    <main>
      {dropdownEnabled && <div className="settings" ref={dropdown} style={{position: "fixed",  borderRadius:"0px 20px 20px 0px", width:"50%", height:"100%", background:"#"+theme, padding:"2px", paddingBottom:"20%", zIndex:"2", display:"block"}}>
      
        <p>Click off or click EXIT to exit the settings.</p><button style={{background:newShade(theme, -40)}} onClick={()=>{setDropdownEnabled(false);}}>EXIT</button><h1 style={{fontWeight:"bold", color:newShade(theme, -100)}}>Theme color:</h1>
      <input type="text" name="theme" value={theme} onChange={(e) => {localStorage.setItem("theme", e.target.value); setTheme( e.target.value);}} className="input1"/>
      <h1 style={{fontWeight:"bold", fontSize:"50px"}}>ADD</h1>
      <h1 style={{fontWeight:"bold", color:newShade(theme, -100)}}>Title:</h1>
      <input placeholder="Enter title!" type="text" name="title" value={title} onChange={(e) => setTitle(e.target.value)} className="input1"/>
      <h1 style={{fontWeight:"bold", color:newShade(theme, -100)}}>Description:</h1>
      <textarea name="desc" placeholder="Enter copy!" style={{width:"95%"}} rows="10"  value={desc} onChange={(e) => setDesc(e.target.value)} className="input1"></textarea>
      <button style={{background:newShade(theme, -40), color:newShade(theme, -100), padding:"2px", marginRight:"4px"}} onClick={() => handleAdd(title, desc)}>+ ADD</button>
      <button style={{background:newShade(theme, -40), color:newShade(theme, -100), padding:"2px"}} onClick={() => handleMassAdd(desc)}>+ Mass ADD</button>
      <div style={{marginTop:"3px"}}>
      <button style={{background:newShade(theme, -40), color:newShade(theme, -100), padding:"2px", marginRight:"4px"}} onClick={() => handleEdit(idS,desc)}>+ Edit</button>
      <input placeholder="Enter id!" type="text" name="title" value={idS} onChange={(e) => setidS(e.target.value)} className="input1"/>
      </div>
      <p>Warning: {warn}</p>
      <h1 style={{fontWeight:"bold", color:newShade(theme, -100)}}>Remove (i):</h1>
      <input style={{marginRight:"4px"}} placeholder="Enter i number!" type="text" name="title" value={removeTitle} onChange={(e) => setremoveTitle(e.target.value)} className="input1"/>
      <button style={{background:newShade(theme, -40), color:newShade(theme, -100), padding:"2px"}} onClick={() => handleRemove(removeTitle)}>- REMOVE</button>
      <hr></hr>
      <button style={{background:newShade(theme, -40), marginRight:"5px"}} onClick={()=>{exportData();}}>Export</button>
      <button style={{background:newShade(theme, -40)}} onClick={()=>{importData();}}>Import</button>
      <a style={{display:"block", width:"20%", marginTop:"20px", background:newShade(theme, -40)}} href="https://github.com/noliuniverse/copyapp">SOURCE CODE.</a>

      </div>}
      <div style={{position:"fixed", background:"white", zIndex:'1', width:"100%", padding:"20px", top:"0px"}}>
      <div className="flex m-auto w-fit	"><button style={{background: "#"+theme, borderRadius:"2px", padding:"5px", marginRight:"5px"}} onClick={()=>{setDropdownEnabled(true)}}>//</button>
      
      <h1 className="header_class">CopyWeb</h1></div>
      </div>
      <div className="div1">
        
      
      {(loading == true) && <p>Loading...</p>}
      <p style={{marginTop:"10px"}}>Search:</p>
      {(loading == false) && <input id='search' value={search} onChange={(e) => setSearch(e.target.value)} type="search" style={{ padding: "2px", borderRadius:"5px",color:"white", background:"black"}}></input>}
      <div className="grid">
      {data && searchFilter(data).map((item, index) => {return <div key={index} className="copy_button" onMouseOver={(e) => e.target.style.background="#" + theme} onMouseOut={(e) => e.target.style.background="rgb(221, 221, 221)"} onClick={() => {handleCopy(item['desc']);}}><p style={{position:"absolute"}}>i: {index}</p><h1 style={{fontWeight:"bold"}}>{item['title'].toString()}</h1><p className="buttonP" style={{textWrap:"wrap", overflow:"hidden", textOverflow:"ellipsis"}}>{item['desc'].toString()}</p></div>})}
      </div>
      </div>
    </main>
  );
}

const serviceData = {
  BA: [
    { code: "BA01", name: "基本身體清潔", price: 260 },
    { code: "BA02", name: "基本日常照顧", price: 195 },
    { code: "BA03", name: "測量生命徵象", price: 35 },
    { code: "BA04", name: "協助進食或管灌餵食", price: 120 },
    { code: "BA05", name: "餐食照顧", price: 310 },
    { code: "BA07", name: "協助沐浴及洗頭", price: 325 },
    { code: "BA08", name: "足部照護", price: 500 },
    { code: "BA09", name: "到宅沐浴車服務-第1型", price: 2200 },
    { code: "BA09a", name: "到宅沐浴車服務-第2型", price: 2500 },
    { code: "BA10", name: "翻身拍背", price: 155 },
    { code: "BA11", name: "肢體關節活動", price: 195 },
    { code: "BA12", name: "協助上下(下)樓梯", price: 130 },
    { code: "BA13", name: "陪同外出", price: 195 },
    { code: "BA14", name: "陪同就醫", price: 685 },
    { code: "BA15-1", name: "家務協助(自用)", price: 195 },
    { code: "BA15-2", name: "家務協助(共用)", price: 114 },
    { code: "BA16", name: "代購或代表領或代送服務(自用)", price: 130 },
    { code: "BA16-2", name: "代購或代表領或代送服務(共用)", price: 76 },
    { code: "BA17a", name: "人工氣道管內分泌物吸物", price: 75 },
    { code: "BA17b", name: "口鼻抽吸", price: 65 },
    { code: "BA17C", name: "管路(尿管、鼻胃管)清潔", price: 50 },
    { code: "BA17d", name: "出診採樣/血糖機驗血糖", price: 50 },
    { code: "BA17e", name: "依指示置入藥盒", price: 50 },
    { code: "BA18", name: "安全看視", price: 50 },
    { code: "BA20", name: "陪伴服務", price: 200 },
    { code: "BA22", name: "導視服務", price: 175 },
    { code: "BA23", name: "協助洗頭", price: 130 },
    { code: "BA24", name: "協助排泄", price: 200 }
  ],
  BB: [
    { code: "BB01", name: "日間照顧(全日)-第1型", price: 675 },
    { code: "BB02", name: "日間照顧(半日)-第1型", price: 340 },
    { code: "BB03", name: "日間照顧(全日)-第2型", price: 840 },
    { code: "BB04", name: "日間照顧(半日)-第2型", price: 420 },
    { code: "BB05", name: "日間照顧(全日)-第3型", price: 920 },
    { code: "BB06", name: "日間照顧(半日)-第3型", price: 460 },
    { code: "BB07", name: "日間照顧(全日)-第4型", price: 1045 },
    { code: "BB08", name: "日間照顧(半日)-第4型", price: 525 },
    { code: "BB09", name: "日間照顧(全日)-第5型", price: 1130 },
    { code: "BB10", name: "日間照顧(半日)-第5型", price: 565 },
    { code: "BB11", name: "日間照顧(全日)-第6型", price: 1210 },
    { code: "BB12", name: "日間照顧(半日)-第6型", price: 605 },
    { code: "BB13", name: "日間照顧(全日)-第7型", price: 1285 },
    { code: "BB14", name: "日間照顧(半日)-第7型", price: 645 }
  ],
  BC: [
    { code: "BC01", name: "家庭托顧(全日)-第1型", price: 625 },
    { code: "BC02", name: "家庭托顧(半日)-第1型", price: 315 },
    { code: "BC03", name: "家庭托顧(全日)-第2型", price: 760 },
    { code: "BC04", name: "家庭托顧(半日)-第2型", price: 380 },
    { code: "BC05", name: "家庭托顧(全日)-第3型", price: 790 },
    { code: "BC06", name: "家庭托顧(半日)-第3型", price: 395 },
    { code: "BC07", name: "家庭托顧(全日)-第4型", price: 885 },
    { code: "BC08", name: "家庭托顧(半日)-第4型", price: 440 },
    { code: "BC09", name: "家庭托顧(全日)-第5型", price: 960 },
    { code: "BC10", name: "家庭托顧(半日)-第5型", price: 480 },
    { code: "BC11", name: "家庭托顧(全日)-第6型", price: 980 },
    { code: "BC12", name: "家庭托顧(半日)-第6型", price: 490 },
    { code: "BC13", name: "家庭托顧(全日)-第7型", price: 1040 },
    { code: "BC14", name: "家庭托顧(半日)-第7型", price: 520 }
  ],
  BD: [
    { code: "BD01", name: "社區式協助沐浴", price: 200 },
    { code: "BD02", name: "社區式晚餐", price: 150 },
    { code: "BD03", name: "社區式服務交通接送", price: 100 }
  ],
  CA: [
    { code: "CA07", name: "IADLs復能、ADLs復能", price: 4500 },
    { code: "CA08", name: "個別化服務計畫(ISP)擬定與執行", price: 6000 }
  ],
  CB: [
    { code: "CB01", name: "營養照護", price: 4000 },
    { code: "CB02", name: "進食與吞嚥照護", price: 9000 },
    { code: "CB03", name: "困難行為照護", price: 9000 },
    { code: "CB04", name: "臥床或長期病房免照護", price: 5000 }
  ],
  CC: [
    { code: "CC01", name: "居家環境安全或無障礙空間規劃", price: 2000 }
  ],
  CD: [
    { code: "CD01", name: "居家護理訪視", price: 1300 },
    { code: "CD02", name: "居家護理指導與諮詢", price: 1500 }
  ],
  DA: [
    { code: "DA01", name: "交通接送", price: 230 }
  ],
  EA: [
    { code: "EA01", name: "馬桶增高器、浴缸止滑墊或洗澡椅", price: 1200 }
  ],
  EB: [
    { code: "EB01", name: "單支拐杖-不鏽鋼", price: 1000 },
    { code: "EB02", name: "單支拐杖-鋁製", price: 500 },
    { code: "EB03", name: "助行器", price: 800 },
    { code: "EB04", name: "帶輪特型助步車(助行椅)", price: 300 }
  ],
  EC: [
    { code: "EC01", name: "輪椅-A款(非標準化產製)", price: 3500 },
    { code: "EC02", name: "輪椅B款(輕便化產製)一般型", price: 4500 },
    { code: "EC03", name: "輪椅C款(重身訂製)訂製型", price: 9000 },
    { code: "EC04", name: "輪椅附加功能-A款(具利於移位功能)", price: 5000 },
    { code: "EC05", name: "輪椅附加功能-B款(具仰躺功能)", price: 2000 },
    { code: "EC06", name: "輪椅附加功能-C款(具空中傾倒功能)", price: 4000 },
    { code: "EC07", name: "擺位系統-A款(平面型椅背靠背)", price: 1000 },
    { code: "EC08", name: "擺位系統-B款(曲面型椅背靠背)", price: 6000 },
    { code: "EC09", name: "擺位系統-C款(椅背框架伸側擴架)", price: 3000 },
    { code: "EC10", name: "擺位系統-D款(椅背頸部系統)", price: 2500 },
    { code: "EC11", name: "電動輪椅(EC11, EC12擇一)(租)", price: 2500 },
    { code: "EC12", name: "電動代步車(EC11, EC12擇一)(租)", price: 1200 }
  ],
  ED: [
    { code: "ED01", name: "移位腰帶", price: 1500 },
    { code: "ED02", name: "移位板", price: 2000 },
    { code: "ED03", name: "人力移位吊帶", price: 4000 },
    { code: "ED04", name: "移位滑墊A款", price: 3000 },
    { code: "ED05", name: "移位滑墊B款", price: 3000 },
    { code: "ED06", name: "移位帶", price: 500 },
    { code: "ED07", name: "移位機(租/購)", price: 20000 },
    { code: "ED08", name: "移位機吊帶", price: 5000 }
  ],
  EE: [
    { code: "EE01", name: "電話擴音器", price: 2000 },
    { code: "EE02", name: "電話閃光提示器", price: 2000 },
    { code: "EE03", name: "火災閃光警示器", price: 2000 },
    { code: "EE04", name: "門檻閃光器", price: 2000 },
    { code: "EE05", name: "無限震動警示器", price: 2000 }
  ],
  EF: [
    { code: "EF01", name: "衣著用輔具", price: 500 },
    { code: "EF02", name: "居家生活輔具", price: 500 },
    { code: "EF03", name: "飲食用輔具", price: 500 }
  ],
  EG: [
    { code: "EG01", name: "氣墊床-A款(組購)", price: 8000 },
    { code: "EG02", name: "氣墊床-B款(組購)", price: 12000 },
    { code: "EG03", name: "輪椅座墊-A款", price: 500 },
    { code: "EG04", name: "輪椅座墊-B款", price: 10000 },
    { code: "EG05", name: "輪椅座墊-C款", price: 10000 },
    { code: "EG06", name: "輪椅座墊-D款", price: 8000 },
    { code: "EG07", name: "輪椅座墊-E款", price: 5000 },
    { code: "EG09", name: "輪椅座墊-G款", price: 5000 }
  ],
  EH: [
    { code: "EH01", name: "居家用照顧床(租/購)", price: 8000 },
    { code: "EH02", name: "居家用照顧床-附加功能款(床面升降)", price: 10000 },
    { code: "EH03", name: "居家用照顧床-附加功能款(電動升降)", price: 15000 },
    { code: "EH04", name: "床椅機(單槍)(租)", price: 700 },
    { code: "EH05", name: "床椅機(月)(租)", price: 400 }
  ],
  FA: [
    { code: "FA01", name: "居家無障礙設施-扶手", price: 150 },
    { code: "FA02", name: "居家無障礙設施-可動扶手", price: 360 },
    { code: "FA03", name: "居家無障礙設施-非固定式斜坡板A款", price: 3500 },
    { code: "FA04", name: "居家無障礙設施-非固定式斜坡板B款", price: 1500 },
    { code: "FA05", name: "居家無障礙設施-非固定式斜坡板C款", price: 1000 },
    { code: "FA06", name: "居家無障礙設施-固定式斜坡板", price: 10000 },
    { code: "FA07", name: "居家無障礙設施-浴室或地板扶手", price: 5000 },
    { code: "FA08", name: "居家無障礙設施-浴缸扶手", price: 2000 },
    { code: "FA09", name: "居家無障礙設施-隔間", price: 6000 },
    { code: "FA10", name: "居家無障礙設施-防滑措施", price: 3000 },
    { code: "FA11", name: "居家無障礙設施-門檻", price: 7000 },
    { code: "FA12", name: "居家無障礙設施-門B板", price: 10000 },
    { code: "FA13", name: "居家無障礙設施-水龍頭", price: 900 },
    { code: "FA14", name: "居家無障礙設施-浴缸", price: 7000 },
    { code: "FA15", name: "居家無障礙設施-改裝洗臉台", price: 3000 },
    { code: "FA16", name: "居家無障礙設施-改裝馬桶", price: 5000 },
    { code: "FA17", name: "居家無障礙設施-壁掛式沖水馬桶", price: 5000 },
    { code: "FA18", name: "居家無障礙設施-軟墊", price: 300 },
    { code: "FA19", name: "居家無障礙設施-特製簡易洗澡椅", price: 1000 },
    { code: "FA20", name: "居家無障礙設施-特製簡易洗澡椅", price: 2000 },
    { code: "FA21", name: "居家無障礙設施-特製簡易浴槽", price: 5000 }
  ],
  GA: [
    { code: "GA03", name: "自日間照顧中心喘息服務-全日", price: 1250 },
    { code: "GA04", name: "日間照顧中心喘息服務-半日", price: 650 },
    { code: "GA05", name: "機構住宿式喘息服務", price: 2310 },
    { code: "GA06", name: "小規模多機能服務-夜間喘息", price

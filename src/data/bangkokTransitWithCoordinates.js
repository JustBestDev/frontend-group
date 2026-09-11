// RoomHub Bangkok transit data enriched with latitude/longitude.
// Station names/order match the current src/data/bangkokTransit.js.
// Coordinates sourced from the Department of Rail Transport station dataset
// (normalized from the DRT dataset reproduced in a 2025 Thammasat University appendix).

export const BANGKOK_TRANSIT_LINES = [
  {
    "id": "BTS_SUKHUMVIT",
    "name": "BTS Sukhumvit Line",
    "shortName": "BTS",
    "color": "#6fa534",
    "stations": [
      {
        "code": "N23",
        "name": "Yaek Kor Por Aor",
        "lat": 13.92502233,
        "lng": 100.6259235
      },
      {
        "code": "N22",
        "name": "Royal Thai Air Force Museum",
        "lat": 13.91794885,
        "lng": 100.6216541
      },
      {
        "code": "N21",
        "name": "Bhumibol Adulyadej Hospital",
        "lat": 13.91070517,
        "lng": 100.6173433
      },
      {
        "code": "N20",
        "name": "Saphan Mai",
        "lat": 13.89660637,
        "lng": 100.6090666
      },
      {
        "code": "N19",
        "name": "Sai Yud",
        "lat": 13.88844049,
        "lng": 100.604197
      },
      {
        "code": "N18",
        "name": "Phahon Yothin 59",
        "lat": 13.88259699,
        "lng": 100.600773
      },
      {
        "code": "N17",
        "name": "Wat Phra Sri Mahathat",
        "lat": 13.87534903,
        "lng": 100.596748
      },
      {
        "code": "N16",
        "name": "11th Infantry Regiment",
        "lat": 13.86755996,
        "lng": 100.5918953
      },
      {
        "code": "N15",
        "name": "Bang Bua",
        "lat": 13.85597345,
        "lng": 100.5851115
      },
      {
        "code": "N14",
        "name": "Royal Forest Department",
        "lat": 13.85039048,
        "lng": 100.5817693
      },
      {
        "code": "N13",
        "name": "Kasetsart University",
        "lat": 13.84237073,
        "lng": 100.577111
      },
      {
        "code": "N12",
        "name": "Sena Nikhom",
        "lat": 13.83635368,
        "lng": 100.573518
      },
      {
        "code": "N11",
        "name": "Ratchayothin",
        "lat": 13.82976184,
        "lng": 100.569629
      },
      {
        "code": "N10",
        "name": "Phahon Yothin 24",
        "lat": 13.82403179,
        "lng": 100.5663319
      },
      {
        "code": "N9",
        "name": "Ha Yaek Lat Phrao",
        "lat": 13.81641185,
        "lng": 100.5619534
      },
      {
        "code": "N8",
        "name": "Mo Chit",
        "lat": 13.8027276,
        "lng": 100.5538694
      },
      {
        "code": "N7",
        "name": "Saphan Khwai",
        "lat": 13.79380459,
        "lng": 100.5497505
      },
      {
        "code": "N5",
        "name": "Ari",
        "lat": 13.77985028,
        "lng": 100.5446531
      },
      {
        "code": "N4",
        "name": "Sanam Pao",
        "lat": 13.77264449,
        "lng": 100.5421253
      },
      {
        "code": "N3",
        "name": "Victory Monument",
        "lat": 13.7628712,
        "lng": 100.5370477
      },
      {
        "code": "N2",
        "name": "Phaya Thai",
        "lat": 13.75700979,
        "lng": 100.5338066
      },
      {
        "code": "N1",
        "name": "Ratchathewi",
        "lat": 13.75207562,
        "lng": 100.5315714
      },
      {
        "code": "CEN",
        "name": "Siam",
        "lat": 13.74561143,
        "lng": 100.5341474
      },
      {
        "code": "E1",
        "name": "Chit Lom",
        "lat": 13.74408069,
        "lng": 100.5430873
      },
      {
        "code": "E2",
        "name": "Phloen Chit",
        "lat": 13.74305844,
        "lng": 100.5490357
      },
      {
        "code": "E3",
        "name": "Nana",
        "lat": 13.74053723,
        "lng": 100.5554754
      },
      {
        "code": "E4",
        "name": "Asok",
        "lat": 13.73704787,
        "lng": 100.5603549
      },
      {
        "code": "E5",
        "name": "Phrom Phong",
        "lat": 13.73045553,
        "lng": 100.5696996
      },
      {
        "code": "E6",
        "name": "Thong Lo",
        "lat": 13.72435715,
        "lng": 100.5784291
      },
      {
        "code": "E7",
        "name": "Ekkamai",
        "lat": 13.71955685,
        "lng": 100.5850876
      },
      {
        "code": "E8",
        "name": "Phra Khanong",
        "lat": 13.71523481,
        "lng": 100.5912765
      },
      {
        "code": "E9",
        "name": "On Nut",
        "lat": 13.70563696,
        "lng": 100.6010277
      },
      {
        "code": "E10",
        "name": "Bang Chak",
        "lat": 13.69673557,
        "lng": 100.6052246
      },
      {
        "code": "E11",
        "name": "Punnawithi",
        "lat": 13.68924559,
        "lng": 100.6090509
      },
      {
        "code": "E12",
        "name": "Udom Suk",
        "lat": 13.67991899,
        "lng": 100.6095904
      },
      {
        "code": "E13",
        "name": "Bang Na",
        "lat": 13.66814729,
        "lng": 100.6047186
      },
      {
        "code": "E14",
        "name": "Bearing",
        "lat": 13.66133924,
        "lng": 100.6019284
      },
      {
        "code": "E15",
        "name": "Samrong",
        "lat": 13.64618067,
        "lng": 100.5955061
      },
      {
        "code": "E16",
        "name": "Pu Chao",
        "lat": 13.63724629,
        "lng": 100.5920546
      },
      {
        "code": "E17",
        "name": "Chang Erawan",
        "lat": 13.62153309,
        "lng": 100.5902021
      },
      {
        "code": "E18",
        "name": "Royal Thai Naval Academy",
        "lat": 13.60845311,
        "lng": 100.5949343
      },
      {
        "code": "E19",
        "name": "Pak Nam",
        "lat": 13.60211662,
        "lng": 100.5971519
      },
      {
        "code": "E20",
        "name": "Srinagarindra",
        "lat": 13.59205817,
        "lng": 100.608983
      },
      {
        "code": "E21",
        "name": "Phraek Sa",
        "lat": 13.58432495,
        "lng": 100.607975
      },
      {
        "code": "E22",
        "name": "Sai Luat",
        "lat": 13.57771156,
        "lng": 100.6054492
      },
      {
        "code": "E23",
        "name": "Kheha",
        "lat": 13.56766421,
        "lng": 100.6077781
      }
    ]
  },
  {
    "id": "BTS_SILOM",
    "name": "BTS Silom Line",
    "shortName": "BTS",
    "color": "#16844a",
    "stations": [
      {
        "code": "W1",
        "name": "National Stadium",
        "lat": 13.7467374,
        "lng": 100.529049
      },
      {
        "code": "CEN",
        "name": "Siam",
        "lat": 13.74561143,
        "lng": 100.5341474
      },
      {
        "code": "S1",
        "name": "Ratchadamri",
        "lat": 13.73945684,
        "lng": 100.5394348
      },
      {
        "code": "S2",
        "name": "Sala Daeng",
        "lat": 13.72845579,
        "lng": 100.5340886
      },
      {
        "code": "S3",
        "name": "Chong Nonsi",
        "lat": 13.7237111,
        "lng": 100.5294617
      },
      {
        "code": "S4",
        "name": "Saint Louis",
        "lat": 13.72092969,
        "lng": 100.5268975
      },
      {
        "code": "S5",
        "name": "Surasak",
        "lat": 13.71921117,
        "lng": 100.5214964
      },
      {
        "code": "S6",
        "name": "Saphan Taksin",
        "lat": 13.71881539,
        "lng": 100.5141108
      },
      {
        "code": "S7",
        "name": "Krung Thon Buri",
        "lat": 13.72084312,
        "lng": 100.5027149
      },
      {
        "code": "S8",
        "name": "Wongwian Yai",
        "lat": 13.72108781,
        "lng": 100.4953148
      },
      {
        "code": "S9",
        "name": "Pho Nimit",
        "lat": 13.71925298,
        "lng": 100.4860682
      },
      {
        "code": "S10",
        "name": "Talat Phlu",
        "lat": 13.71422607,
        "lng": 100.4768081
      },
      {
        "code": "S11",
        "name": "Wutthakat",
        "lat": 13.71307476,
        "lng": 100.4689102
      },
      {
        "code": "S12",
        "name": "Bang Wa",
        "lat": 13.72052948,
        "lng": 100.457791
      }
    ]
  },
  {
    "id": "BTS_GOLD",
    "name": "BTS Gold Line",
    "shortName": "G",
    "color": "#b38b35",
    "stations": [
      {
        "code": "G1",
        "name": "Krung Thon Buri",
        "lat": 13.72111862,
        "lng": 100.5036484
      },
      {
        "code": "G2",
        "name": "Charoen Nakhon",
        "lat": 13.72652947,
        "lng": 100.5089743
      },
      {
        "code": "G3",
        "name": "Khlong San",
        "lat": 13.73045608,
        "lng": 100.5076094
      }
    ]
  },
  {
    "id": "MRT_BLUE",
    "name": "MRT Blue Line",
    "shortName": "BL",
    "color": "#1764a3",
    "stations": [
      {
        "code": "BL01",
        "name": "Tha Phra",
        "lat": 13.72969778,
        "lng": 100.4741528
      },
      {
        "code": "BL02",
        "name": "Charan 13",
        "lat": 13.7403604,
        "lng": 100.4706533
      },
      {
        "code": "BL03",
        "name": "Fai Chai",
        "lat": 13.75513012,
        "lng": 100.469225
      },
      {
        "code": "BL04",
        "name": "Bang Khun Non",
        "lat": 13.76322858,
        "lng": 100.4732075
      },
      {
        "code": "BL05",
        "name": "Bang Yi Khan",
        "lat": 13.77753717,
        "lng": 100.485243
      },
      {
        "code": "BL06",
        "name": "Sirindhorn",
        "lat": 13.78406434,
        "lng": 100.4934785
      },
      {
        "code": "BL07",
        "name": "Bang Phlat",
        "lat": 13.79255197,
        "lng": 100.5050425
      },
      {
        "code": "BL08",
        "name": "Bang O",
        "lat": 13.79901673,
        "lng": 100.5096999
      },
      {
        "code": "BL09",
        "name": "Bang Pho",
        "lat": 13.80646721,
        "lng": 100.5210402
      },
      {
        "code": "BL10",
        "name": "Tao Poon",
        "lat": 13.80621259,
        "lng": 100.530759
      },
      {
        "code": "BL11",
        "name": "Bang Sue",
        "lat": 13.80312385,
        "lng": 100.5391893
      },
      {
        "code": "BL12",
        "name": "Kamphaeng Phet",
        "lat": 13.79809541,
        "lng": 100.5475954
      },
      {
        "code": "BL13",
        "name": "Chatuchak Park",
        "lat": 13.80213175,
        "lng": 100.5530476
      },
      {
        "code": "BL14",
        "name": "Phahon Yothin",
        "lat": 13.81434869,
        "lng": 100.5601448
      },
      {
        "code": "BL15",
        "name": "Lat Phrao",
        "lat": 13.806243,
        "lng": 100.5739567
      },
      {
        "code": "BL16",
        "name": "Ratchadaphisek",
        "lat": 13.79915789,
        "lng": 100.5746119
      },
      {
        "code": "BL17",
        "name": "Sutthisan",
        "lat": 13.78973963,
        "lng": 100.5742003
      },
      {
        "code": "BL18",
        "name": "Huai Khwang",
        "lat": 13.77852705,
        "lng": 100.5736394
      },
      {
        "code": "BL19",
        "name": "Thailand Cultural Centre",
        "lat": 13.76627655,
        "lng": 100.5702328
      },
      {
        "code": "BL20",
        "name": "Phra Ram 9",
        "lat": 13.75791625,
        "lng": 100.5655452
      },
      {
        "code": "BL21",
        "name": "Phetchaburi",
        "lat": 13.74868501,
        "lng": 100.5631611
      },
      {
        "code": "BL22",
        "name": "Sukhumvit",
        "lat": 13.73855034,
        "lng": 100.5614557
      },
      {
        "code": "BL23",
        "name": "Queen Sirikit National Convention Centre",
        "lat": 13.72315611,
        "lng": 100.5601051
      },
      {
        "code": "BL24",
        "name": "Khlong Toei",
        "lat": 13.72233526,
        "lng": 100.5539195
      },
      {
        "code": "BL25",
        "name": "Lumphini",
        "lat": 13.72577127,
        "lng": 100.5456769
      },
      {
        "code": "BL26",
        "name": "Si Lom",
        "lat": 13.72926025,
        "lng": 100.5365456
      },
      {
        "code": "BL27",
        "name": "Sam Yan",
        "lat": 13.73234822,
        "lng": 100.5299815
      },
      {
        "code": "BL28",
        "name": "Hua Lamphong",
        "lat": 13.73783973,
        "lng": 100.5171627
      },
      {
        "code": "BL29",
        "name": "Wat Mangkon",
        "lat": 13.74201328,
        "lng": 100.5101788
      },
      {
        "code": "BL30",
        "name": "Sam Yot",
        "lat": 13.74715729,
        "lng": 100.5022257
      },
      {
        "code": "BL31",
        "name": "Sanam Chai",
        "lat": 13.74394426,
        "lng": 100.4945866
      },
      {
        "code": "BL32",
        "name": "Itsaraphap",
        "lat": 13.73832048,
        "lng": 100.4852921
      },
      {
        "code": "BL33",
        "name": "Bang Phai",
        "lat": 13.72459435,
        "lng": 100.4651747
      },
      {
        "code": "BL34",
        "name": "Bang Wa",
        "lat": 13.72039546,
        "lng": 100.4571675
      },
      {
        "code": "BL35",
        "name": "Phetkasem 48",
        "lat": 13.71550917,
        "lng": 100.4456044
      },
      {
        "code": "BL36",
        "name": "Phasi Charoen",
        "lat": 13.71288542,
        "lng": 100.4341567
      },
      {
        "code": "BL37",
        "name": "Bang Khae",
        "lat": 13.71194125,
        "lng": 100.4223819
      },
      {
        "code": "BL38",
        "name": "Lak Song",
        "lat": 13.7109686,
        "lng": 100.4099721
      }
    ]
  },
  {
    "id": "MRT_PURPLE",
    "name": "MRT Purple Line",
    "shortName": "PP",
    "color": "#7b3f98",
    "stations": [
      {
        "code": "PP01",
        "name": "Khlong Bang Phai",
        "lat": 13.89253436,
        "lng": 100.4082496
      },
      {
        "code": "PP02",
        "name": "Talad Bang Yai",
        "lat": 13.88112798,
        "lng": 100.4092513
      },
      {
        "code": "PP03",
        "name": "Sam Yaek Bang Yai",
        "lat": 13.87456616,
        "lng": 100.4194113
      },
      {
        "code": "PP04",
        "name": "Bang Phlu",
        "lat": 13.87572623,
        "lng": 100.4338654
      },
      {
        "code": "PP05",
        "name": "Bang Rak Yai",
        "lat": 13.87660559,
        "lng": 100.4449095
      },
      {
        "code": "PP06",
        "name": "Bang Rak Noi Tha It",
        "lat": 13.87479655,
        "lng": 100.4559496
      },
      {
        "code": "PP07",
        "name": "Sai Ma",
        "lat": 13.87050059,
        "lng": 100.4666311
      },
      {
        "code": "PP08",
        "name": "Phra Nang Klao Bridge",
        "lat": 13.8703241,
        "lng": 100.4803656
      },
      {
        "code": "PP09",
        "name": "Yaek Nonthaburi 1",
        "lat": 13.86581435,
        "lng": 100.4946124
      },
      {
        "code": "PP10",
        "name": "Bang Krasor",
        "lat": 13.86169155,
        "lng": 100.504486
      },
      {
        "code": "PP11",
        "name": "Nonthaburi Civic Center",
        "lat": 13.8602065,
        "lng": 100.5132428
      },
      {
        "code": "PP12",
        "name": "Ministry of Public Health",
        "lat": 13.84867734,
        "lng": 100.5146738
      },
      {
        "code": "PP13",
        "name": "Yaek Tiwanon",
        "lat": 13.83957886,
        "lng": 100.5148801
      },
      {
        "code": "PP14",
        "name": "Wong Sawang",
        "lat": 13.83006051,
        "lng": 100.5264559
      },
      {
        "code": "PP15",
        "name": "Bang Son",
        "lat": 13.82033224,
        "lng": 100.5324967
      },
      {
        "code": "PP16",
        "name": "Tao Poon",
        "lat": 13.80621259,
        "lng": 100.530759
      }
    ]
  },
  {
    "id": "MRT_YELLOW",
    "name": "MRT Yellow Line",
    "shortName": "YL",
    "code": "YL",
    "color": "#f5c400",
    "stations": [
      {
        "code": "YL01",
        "name": "Lat Phrao",
        "lat": 13.80642537,
        "lng": 100.5750188
      },
      {
        "code": "YL02",
        "name": "Phawana",
        "lat": 13.80011847,
        "lng": 100.5842163
      },
      {
        "code": "YL03",
        "name": "Chok Chai 4",
        "lat": 13.79442539,
        "lng": 100.5943619
      },
      {
        "code": "YL04",
        "name": "Lat Phrao 71",
        "lat": 13.78728606,
        "lng": 100.6071587
      },
      {
        "code": "YL05",
        "name": "Lat Phrao 83",
        "lat": 13.78365274,
        "lng": 100.6137309
      },
      {
        "code": "YL06",
        "name": "Mahat Thai",
        "lat": 13.7780628,
        "lng": 100.6237065
      },
      {
        "code": "YL07",
        "name": "Lat Phrao 101",
        "lat": 13.77436537,
        "lng": 100.6303535
      },
      {
        "code": "YL08",
        "name": "Bang Kapi",
        "lat": 13.76910863,
        "lng": 100.6398086
      },
      {
        "code": "YL09",
        "name": "Yaek Lam Sali",
        "lat": 13.76136904,
        "lng": 100.6454823
      },
      {
        "code": "YL10",
        "name": "Si Kritha",
        "lat": 13.75080762,
        "lng": 100.6449158
      },
      {
        "code": "YL11",
        "name": "Hua Mak",
        "lat": 13.7364372,
        "lng": 100.641316
      },
      {
        "code": "YL12",
        "name": "Kalantan",
        "lat": 13.7256816,
        "lng": 100.6417183
      },
      {
        "code": "YL13",
        "name": "Si Nut",
        "lat": 13.712651,
        "lng": 100.643577
      },
      {
        "code": "YL14",
        "name": "Srinagarindra 38",
        "lat": 13.70063689,
        "lng": 100.6464554
      },
      {
        "code": "YL15",
        "name": "Suan Luang Rama IX",
        "lat": 13.69072764,
        "lng": 100.6471035
      },
      {
        "code": "YL16",
        "name": "Si Udom",
        "lat": 13.67778455,
        "lng": 100.6460782
      },
      {
        "code": "YL17",
        "name": "Si Iam",
        "lat": 13.66652118,
        "lng": 100.6443196
      },
      {
        "code": "YL18",
        "name": "Si La Salle",
        "lat": 13.65600333,
        "lng": 100.642373
      },
      {
        "code": "YL19",
        "name": "Si Bearing",
        "lat": 13.64453762,
        "lng": 100.6368896
      },
      {
        "code": "YL20",
        "name": "Si Dan",
        "lat": 13.63192221,
        "lng": 100.6294477
      },
      {
        "code": "YL21",
        "name": "Si Thepha",
        "lat": 13.62782906,
        "lng": 100.6264504
      },
      {
        "code": "YL22",
        "name": "Thipphawan",
        "lat": 13.63748659,
        "lng": 100.6086469
      },
      {
        "code": "YL23",
        "name": "Samrong",
        "lat": 13.64511811,
        "lng": 100.5964632
      }
    ]
  },
  {
    "id": "MRT_PINK",
    "name": "MRT Pink Line",
    "shortName": "PK",
    "code": "PK",
    "color": "#e85b91",
    "stations": [
      {
        "code": "PK01",
        "name": "Nonthaburi Civic Center",
        "lat": 13.86009775,
        "lng": 100.5181445
      },
      {
        "code": "PK02",
        "name": "Khae Rai",
        "lat": 13.86255791,
        "lng": 100.5207688
      },
      {
        "code": "PK03",
        "name": "Sanambin Nam",
        "lat": 13.8741295,
        "lng": 100.516286
      },
      {
        "code": "PK04",
        "name": "Samakkhi",
        "lat": 13.88919555,
        "lng": 100.5106468
      },
      {
        "code": "PK05",
        "name": "Royal Irrigation Department",
        "lat": 13.8986368,
        "lng": 100.5071267
      },
      {
        "code": "PK06",
        "name": "Yaek Pak Kret",
        "lat": 13.90644318,
        "lng": 100.5054788
      },
      {
        "code": "PK07",
        "name": "Pak Kret Bypass",
        "lat": 13.90644017,
        "lng": 100.5157988
      },
      {
        "code": "PK08",
        "name": "Chaeng Watthana-Pak Kret 28",
        "lat": 13.9041046,
        "lng": 100.5291645
      },
      {
        "code": "PK09",
        "name": "Si Rat",
        "lat": 13.90058216,
        "lng": 100.5398762
      },
      {
        "code": "PK10",
        "name": "Muang Thong Thani",
        "lat": 13.89747577,
        "lng": 100.5483386
      },
      {
        "code": "PK11",
        "name": "Chaeng Watthana 14",
        "lat": 13.89313571,
        "lng": 100.5603441
      },
      {
        "code": "PK12",
        "name": "Government Complex",
        "lat": 13.89071127,
        "lng": 100.5673977
      },
      {
        "code": "PK13",
        "name": "National Telecom",
        "lat": 13.88742603,
        "lng": 100.5757986
      },
      {
        "code": "PK14",
        "name": "Lak Si",
        "lat": 13.88409464,
        "lng": 100.5825889
      },
      {
        "code": "PK15",
        "name": "Rajabhat Phranakhon",
        "lat": 13.87981519,
        "lng": 100.5895093
      },
      {
        "code": "PK16",
        "name": "Wat Phra Sri Mahathat",
        "lat": 13.87447087,
        "lng": 100.5972522
      },
      {
        "code": "PK17",
        "name": "Ram Inthra 3",
        "lat": 13.87082295,
        "lng": 100.6028642
      },
      {
        "code": "PK18",
        "name": "Lat Pla Khao",
        "lat": 13.86268274,
        "lng": 100.617954
      },
      {
        "code": "PK19",
        "name": "Ram Inthra Kor Mor 4",
        "lat": 13.85825785,
        "lng": 100.6261589
      },
      {
        "code": "PK20",
        "name": "Maiyalap",
        "lat": 13.85503112,
        "lng": 100.6322456
      },
      {
        "code": "PK21",
        "name": "Vacharaphol",
        "lat": 13.84994098,
        "lng": 100.6416164
      },
      {
        "code": "PK22",
        "name": "Ram Inthra Kor Mor 6",
        "lat": 13.84519546,
        "lng": 100.6503373
      },
      {
        "code": "PK23",
        "name": "Khu Bon",
        "lat": 13.84047281,
        "lng": 100.6590814
      },
      {
        "code": "PK24",
        "name": "Ram Inthra Kor Mor 9",
        "lat": 13.83384417,
        "lng": 100.6674932
      },
      {
        "code": "PK25",
        "name": "Outer Ring Road-Ram Inthra",
        "lat": 13.82462893,
        "lng": 100.6770457
      },
      {
        "code": "PK26",
        "name": "Nopparat",
        "lat": 13.81656568,
        "lng": 100.685544
      },
      {
        "code": "PK27",
        "name": "Bang Chan",
        "lat": 13.81274187,
        "lng": 100.7034107
      },
      {
        "code": "PK28",
        "name": "Setthabutbamphen",
        "lat": 13.8126908,
        "lng": 100.7131798
      },
      {
        "code": "PK29",
        "name": "Min Buri Market",
        "lat": 13.81256467,
        "lng": 100.7256391
      },
      {
        "code": "PK30",
        "name": "Min Buri",
        "lat": 13.80844328,
        "lng": 100.7326648
      }
    ]
  },
  {
    "id": "AIRPORT_RAIL_LINK",
    "name": "Airport Rail Link",
    "shortName": "A",
    "color": "#9b1b30",
    "stations": [
      {
        "code": "A1",
        "name": "Suvarnabhumi",
        "lat": 13.69790742,
        "lng": 100.7522493
      },
      {
        "code": "A2",
        "name": "Lat Krabang",
        "lat": 13.7278904,
        "lng": 100.7486236
      },
      {
        "code": "A3",
        "name": "Ban Thap Chang",
        "lat": 13.73282618,
        "lng": 100.6913061
      },
      {
        "code": "A4",
        "name": "Hua Mak",
        "lat": 13.73804799,
        "lng": 100.6451781
      },
      {
        "code": "A5",
        "name": "Ramkhamhaeng",
        "lat": 13.74298957,
        "lng": 100.6001476
      },
      {
        "code": "A6",
        "name": "Makkasan",
        "lat": 13.75103218,
        "lng": 100.5612032
      },
      {
        "code": "A7",
        "name": "Ratchaprarop",
        "lat": 13.75510533,
        "lng": 100.5421521
      },
      {
        "code": "A8",
        "name": "Phaya Thai",
        "lat": 13.75677853,
        "lng": 100.5348391
      }
    ]
  },
  {
    "id": "SRT_RED",
    "name": "SRT Red Line",
    "shortName": "RN",
    "color": "#a32638",
    "stations": [
      {
        "code": "RN01",
        "name": "Krung Thep Aphiwat",
        "lat": 13.80464389,
        "lng": 100.5420537
      },
      {
        "code": "RN02",
        "name": "Chatuchak",
        "lat": 13.82652595,
        "lng": 100.5493932
      },
      {
        "code": "RN03",
        "name": "Wat Samian Nari",
        "lat": 13.84168597,
        "lng": 100.5575223
      },
      {
        "code": "RN04",
        "name": "Bang Khen",
        "lat": 13.84696561,
        "lng": 100.5607408
      },
      {
        "code": "RN05",
        "name": "Thung Song Hong",
        "lat": 13.86020462,
        "lng": 100.5673919
      },
      {
        "code": "RN06",
        "name": "Lak Si",
        "lat": 13.88624187,
        "lng": 100.5818476
      },
      {
        "code": "RN07",
        "name": "Kan Kheha",
        "lat": 13.89861755,
        "lng": 100.5890021
      },
      {
        "code": "RN08",
        "name": "Don Mueang",
        "lat": 13.91507215,
        "lng": 100.5979559
      },
      {
        "code": "RN09",
        "name": "Lak Hok",
        "lat": 13.96583148,
        "lng": 100.6053144
      },
      {
        "code": "RN10",
        "name": "Rangsit",
        "lat": 13.99065039,
        "lng": 100.602157
      }
    ]
  }
];

export const getStationKey = (lineId, stationCode) =>
  `${lineId}:${stationCode}`;

export const getAllTransitStations = () =>
  BANGKOK_TRANSIT_LINES.flatMap((line) =>
    line.stations.map((station) => ({
      ...station,
      lineId: line.id,
      lineName: line.name,
      lineColor: line.color,
      key: getStationKey(line.id, station.code),
    }))
  );

export const haversineDistanceKm = (lat1, lng1, lat2, lng2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const findNearestTransitStation = (latitude, longitude) => {
  const stations = getAllTransitStations();

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

  return stations.reduce((nearest, station) => {
    const distanceKm = haversineDistanceKm(
      latitude,
      longitude,
      station.lat,
      station.lng
    );

    if (!nearest || distanceKm < nearest.distanceKm) {
      return { ...station, distanceKm };
    }

    return nearest;
  }, null);
};

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private http:HttpClient) { }

  getData(){
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'asd'
      })
    };
    return this.http.get("http://209.58.160.20:3002/vertex/",httpOptions);
  }

  postRawJson():Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        
        Authorization: 'asd'
      })
    };

    const body:any = {
      "mxGraphModel": {
        "root": {
          "mxCell": [
            {
              "@id": "0"
            },
            {
              "@id": "1",
              "@parent": "0"
            },
            {
              "@id": "3",
              "@value": "Test",
              "@style": "port;image=../assets/circle.png;spacingLeft=18",
              "@vertex": "1",
              "@parent": "2",
              "mxGeometry": {
                "@x": "0.98",
                "@y": "0.84",
                "@width": "16",
                "@height": "16",
                "@relative": "1",
                "@as": "geometry"
              }
            },
            {
              "@id": "5",
              "@value": "Test",
              "@style": "port;image=../assets/circle.png;spacingLeft=18",
              "@vertex": "1",
              "@parent": "4",
              "mxGeometry": {
                "@x": "0.98",
                "@y": "0.84",
                "@width": "16",
                "@height": "16",
                "@relative": "1",
                "@as": "geometry"
              }
            },
            {
              "@id": "6",
              "@value": "",
              "@edge": "1",
              "@parent": "1",
              "@source": "3",
              "@target": "4",
              "mxGeometry": {
                "@relative": "1",
                "@as": "geometry"
              }
            },
            {
              "@id": "9",
              "@value": "Test",
              "@style": "port;image=../assets/circle.png;spacingLeft=18",
              "@vertex": "1",
              "@parent": "8",
              "mxGeometry": {
                "@x": "0.98",
                "@y": "0.84",
                "@width": "16",
                "@height": "16",
                "@relative": "1",
                "@as": "geometry"
              }
            },
            {
              "@id": "10",
              "@value": "",
              "@edge": "1",
              "@parent": "1",
              "@source": "7",
              "@target": "8",
              "mxGeometry": {
                "@relative": "1",
                "@as": "geometry"
              }
            }
          ],
          "UserObject": [
            {
              "@id": "2",
              "mxCell": {
                "@style": "rounded=1;whiteSpace=wrap;autosize=1;resizable=0;",
                "@vertex": "1",
                "@parent": "1",
                "mxGeometry": {
                  "@x": "-320",
                  "@y": "-110",
                  "@width": "330",
                  "@height": "177",
                  "@as": "geometry"
                },
                "div": {
                  "@xmlns": "http://www.w3.org/1999/xhtml",
                  "@as": "div",
                  "div": {
                    "@id": "flow0",
                    "@class": "custom-card flow-start-container shadow-lg p-3 mt-3 bg-white",
                    "@style": "border-radius: 33px; border-color: transparent;",
                    "div": [
                      {
                        "@class": "tooltip-parent"
                      },
                      {
                        "@class": "card",
                        "@style": "border-radius:35px;border:0px;width:300px",
                        "div": [
                          {
                            "@id": "card-header0",
                            "@class": "card-header",
                            "@style": "background-color:white;",
                            "img": {
                              "@src": "../assets/play.png",
                              "@class": "start-icon float-left",
                              "@alt": "..."
                            },
                            "div": {
                              "@style": "margin-left:60px;margin-top:5px;",
                              "h4": {
                                "@id": "header0",
                                "@class": "header",
                                "#text": "Starting Step"
                              }
                            }
                          },
                          {
                            "@id": "card-body0",
                            "@class": "card-body flow-start-trigger-list max-h-150"
                          },
                          {
                            "@class": "card-footer",
                            "@style": "background-color:white;",
                            "div": {
                              "@class": "row",
                              "div": {
                                "@class": "col-md-12 btnAppend",
                                "button": {
                                  "@type": "button",
                                  "@class": "btn btn-outline-secondary btn-block btnAddTrigger",
                                  "#text": "Add Trigger"
                                }
                              }
                            }
                          }
                        ]
                      }
                    ],
                    "span": {
                      "@class": "tooltip-text",
                      "div": {
                        "@class": "d-inline img-icon mr-2",
                        "img": {
                          "@class": "delete",
                          "@src": "../assets/delete.png"
                        }
                      },
                      "img": {
                        "@class": "copy",
                        "@src": "../assets/copy.png"
                      }
                    }
                  },
                  "br": null
                }
              }
            },
            {
              "@id": "4",
              "mxCell": {
                "@style": "rounded=1;whiteSpace=wrap;autosize=1;resizable=0;",
                "@vertex": "1",
                "@parent": "1",
                "mxGeometry": {
                  "@x": "210",
                  "@width": "330",
                  "@height": "237",
                  "@as": "geometry"
                },
                "div": {
                  "@xmlns": "http://www.w3.org/1999/xhtml",
                  "@as": "div",
                  "div": {
                    "@id": "flow1",
                    "@class": "custom-card flow-start-container shadow-lg p-3 mt-3 bg-white",
                    "@style": "border-radius: 33px; border-color: transparent;",
                    "div": [
                      {
                        "@class": "tooltip-parent"
                      },
                      {
                        "@class": "card",
                        "@style": "border-radius:35px;border:0px;width:300px",
                        "div": [
                          {
                            "@id": "card-header1",
                            "@class": "card-header",
                            "@style": "background-color:white;",
                            "img": {
                              "@src": "../assets/play.png",
                              "@class": "start-icon float-left",
                              "@alt": "..."
                            },
                            "div": {
                              "@style": "margin-left:60px;margin-top:5px;",
                              "h4": {
                                "@id": "header1",
                                "@class": "header",
                                "#text": "First Step"
                              }
                            }
                          },
                          {
                            "@id": "card-body1",
                            "@class": "card-body flow-start-trigger-list max-h-150",
                            "@style": "height: 60px;"
                          },
                          {
                            "@class": "card-footer",
                            "@style": "background-color:white;",
                            "div": {
                              "@class": "row",
                              "div": {
                                "@class": "col-md-12 btnAppend",
                                "button": {
                                  "@type": "button",
                                  "@class": "btn btn-outline-secondary btn-block btnAddTrigger",
                                  "#text": "Add Trigger"
                                }
                              }
                            }
                          }
                        ]
                      }
                    ],
                    "span": {
                      "@class": "tooltip-text",
                      "div": {
                        "@class": "d-inline img-icon mr-2",
                        "img": {
                          "@class": "delete",
                          "@src": "../assets/delete.png"
                        }
                      },
                      "img": {
                        "@class": "copy",
                        "@src": "../assets/copy.png"
                      }
                    }
                  },
                  "br": null
                }
              }
            },
            {
              "@id": "8",
              "mxCell": {
                "@style": "rounded=1;whiteSpace=wrap;autosize=1;resizable=0;",
                "@vertex": "1",
                "@parent": "1",
                "mxGeometry": {
                  "@x": "740",
                  "@y": "10",
                  "@width": "330",
                  "@height": "177",
                  "@as": "geometry"
                },
                "div": {
                  "@xmlns": "http://www.w3.org/1999/xhtml",
                  "@as": "div",
                  "div": {
                    "@id": "flow2",
                    "@class": "custom-card flow-start-container shadow-lg p-3 mt-3 bg-white",
                    "@style": "border-radius: 33px; border-color: transparent;",
                    "div": [
                      {
                        "@class": "tooltip-parent"
                      },
                      {
                        "@class": "card",
                        "@style": "border-radius:35px;border:0px;width:300px",
                        "div": [
                          {
                            "@id": "card-header2",
                            "@class": "card-header",
                            "@style": "background-color:white;",
                            "img": {
                              "@src": "../assets/play.png",
                              "@class": "start-icon float-left",
                              "@alt": "..."
                            },
                            "div": {
                              "@style": "margin-left:60px;margin-top:5px;",
                              "h4": {
                                "@id": "header2",
                                "@class": "header",
                                "#text": "Second Step"
                              }
                            }
                          },
                          {
                            "@id": "card-body2",
                            "@class": "card-body flow-start-trigger-list max-h-150"
                          },
                          {
                            "@class": "card-footer",
                            "@style": "background-color:white;",
                            "div": {
                              "@class": "row",
                              "div": {
                                "@class": "col-md-12 btnAppend",
                                "button": {
                                  "@type": "button",
                                  "@class": "btn btn-outline-secondary btn-block btnAddTrigger",
                                  "#text": "Add Trigger"
                                }
                              }
                            }
                          }
                        ]
                      }
                    ],
                    "span": {
                      "@class": "tooltip-text",
                      "div": {
                        "@class": "d-inline img-icon mr-2",
                        "img": {
                          "@class": "delete",
                          "@src": "../assets/delete.png"
                        }
                      },
                      "img": {
                        "@class": "copy",
                        "@src": "../assets/copy.png"
                      }
                    }
                  },
                  "br": null
                }
              }
            }
          ],
          "InitialMessage": [
            {
              "@id": "InitialMesssage_2",
              "mxCell": {
                "@style": "resizable=0;constituent=1;movable=0;strokeColor=none;",
                "@vertex": "1",
                "@connectable": "0",
                "@parent": "2",
                "mxGeometry": {
                  "@x": "100",
                  "@y": "70",
                  "@width": "135",
                  "@height": "40",
                  "@as": "geometry"
                },
                "div": {
                  "@xmlns": "http://www.w3.org/1999/xhtml",
                  "@as": "div",
                  "span": " Flow starts with the following step. <br xmlns=\"http://www.w3.org/1999/xhtml\" /> Click to add the triggers. ",
                  "br": null
                }
              }
            },
            {
              "@id": "InitialMesssage_8",
              "mxCell": {
                "@style": "resizable=0;constituent=1;movable=0;strokeColor=none;",
                "@vertex": "1",
                "@connectable": "0",
                "@parent": "8",
                "mxGeometry": {
                  "@x": "100",
                  "@y": "70",
                  "@width": "135",
                  "@height": "40",
                  "@as": "geometry"
                },
                "div": {
                  "@xmlns": "http://www.w3.org/1999/xhtml",
                  "@as": "div",
                  "span": " Flow starts with the following step. <br xmlns=\"http://www.w3.org/1999/xhtml\" /> Click to add the triggers. ",
                  "br": null
                }
              }
            }
          ],
          "triggers": {
            "@id": "7",
            "mxCell": {
              "@style": "resizable=0;constituent=1;movable=0;strokeColor=none;",
              "@vertex": "1",
              "@parent": "4",
              "mxGeometry": {
                "@x": "100",
                "@y": "100",
                "@width": "135",
                "@height": "40",
                "@as": "geometry"
              },
              "div": {
                "@xmlns": "http://www.w3.org/1999/xhtml",
                "@as": "div",
                "br": null,
                "button": {
                  "@type": "button",
                  "@style": "width:150px;",
                  "@class": "btn btn-primary btn-block btnAddTrigger btn-lg",
                  "#text": "Text1"
                }
              }
            }
          }
        }
      }
    };
    return this.http.post<any>("http://209.58.160.20:3002/mxgraph/5ff56c587efe1d4649d6e191",body,httpOptions);
  }

  retrieveJson(){
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'asd'
      })
    };
    return this.http.get("http://209.58.160.20:3002/mxgraph/5ff56c587efe1d4649d6e191",httpOptions);
  }
 
}

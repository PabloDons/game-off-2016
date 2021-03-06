function ms(size, numbombs) {
    this.numbombs = numbombs;
    this.size = {y:size,x:Math.round((size/9)*16)};
    this.map = [];
    this.flags = 0;


    for (var i=0;i<this.size.y;i++){
        this.map[i]=[];
        for (var j=0;j<this.size.x;j++){
            this.map[i][j] = {
                isB:false,
                sel:false,
                numOfAdj:0,
                flagged:false,
            };
        }
    }

    for (var i=0;i<numbombs;i++) {
        var bomb = {
            x:Math.floor(Math.random()*(this.size.x-1)),
            y:Math.floor(Math.random()*(this.size.y-1))
        };
        if (this.map[bomb.y][bomb.x].isB) {
            i--;
            continue;
        } else {
            this.map[bomb.y][bomb.x].isB = true;
            if (bomb.y!==0) {
                this.map[bomb.y-1][bomb.x].numOfAdj+=1;
                if (bomb.x!==0) {
                    this.map[bomb.y-1][bomb.x-1].numOfAdj+=1;
                } if (bomb.x!==this.size.x-1) {
                    this.map[bomb.y-1][bomb.x+1].numOfAdj+=1;
                }
            } if (bomb.y!==this.size.y-1) {
                this.map[bomb.y+1][bomb.x].numOfAdj+=1;
                if (bomb.x!==0) {
                    this.map[bomb.y+1][bomb.x-1].numOfAdj+=1;
                } if (bomb.x!==this.size.x-1) {
                    this.map[bomb.y+1][bomb.x+1].numOfAdj+=1;
                }
            }
            if (bomb.x!==0) {
                this.map[bomb.y][bomb.x-1].numOfAdj+=1;
            } if (bomb.x!==this.size.x-1) {
                this.map[bomb.y][bomb.x+1].numOfAdj+=1;
            }
        }
    }
}
ms.prototype.getMap = function (req) {
    var map = [];
    for (var i=0;i<this.size.y;i++) {
        map[i] = [];
        for (var j=0;j<this.size.x;j++) {
            map[i][j] = {sel:this.map[i][j].sel};
            if (this.map[i][j].sel) {
                map[i][j].numOfAdj = this.map[i][j].numOfAdj;
            } else {
                map[i][j].flagged = this.map[i][j].flagged;
            }
        }
    }
    return map;
};
ms.prototype.flag = function (req) {
    if (this.map[req.y][req.x].flagged) {
        this.flags--;
        this.map[req.y][req.x].flagged = false;
        return {flag:false, x:req.x, y:req.y};
    }
    this.flags++;
    this.map[req.y][req.x].flagged = true;
    return {flag:true, x:req.x,y:req.y};
};
ms.prototype.clickBox = function (req) {
    // console.log("clickbox called at "+JSON.stringify(req));
    var ret = {hit:false,act:[{x:req.x,y:req.y,numOfAdj:this.map[req.y][req.x].numOfAdj}]};
    if (this.map[req.y][req.x].isB) {
        ret.hit = true;
        return ret;
    }

    this.map[req.y][req.x].sel = true;
    if (this.map[req.y][req.x].numOfAdj===0) {
        if (req.y>0) {
            if (!this.map[req.y-1][req.x].sel) {
                this.map[req.y-1][req.x].sel = true;
                ret.act = ret.act.concat(this.clickBox({y:req.y-1, x:req.x}).act);
            }
            if (req.x>0) {
                if (!this.map[req.y-1][req.x-1].sel) {
                    this.map[req.y-1][req.x-1].sel = true;
                    ret.act = ret.act.concat(this.clickBox({y:req.y-1, x:req.x-1}).act);
                }
            }
            if (req.x<this.size.x-1) {
                if (!this.map[req.y-1][req.x+1].sel) {
                    this.map[req.y-1][req.x+1].sel = true;
                    ret.act = ret.act.concat(this.clickBox({y:req.y-1, x:req.x+1}).act);
                }
            }
        } if (req.y<this.size.y-1) {
            if (!this.map[req.y+1][req.x].sel) {
                this.map[req.y+1][req.x].sel = true;
                ret.act = ret.act.concat(this.clickBox({y:req.y+1, x:req.x}).act);
            }
            if (req.x>0) {
                if (!this.map[req.y+1][req.x-1].sel) {
                    this.map[req.y+1][req.x-1].sel = true;
                    ret.act = ret.act.concat(this.clickBox({y:req.y+1, x:req.x-1}).act);
                }
            }
            if (req.x<this.size.x-1) {
                if (!this.map[req.y+1][req.x+1].sel) {
                    this.map[req.y+1][req.x+1].sel = true;
                    ret.act = ret.act.concat(this.clickBox({y:req.y+1, x:req.x+1}).act);
                }
            }
        }
        if (req.x>0) {
            if (!this.map[req.y][req.x-1].sel) {
                this.map[req.y][req.x-1].sel = true;
                ret.act = ret.act.concat(this.clickBox({y:req.y, x:req.x-1}).act);
            }
        }
        if (req.x<this.size.x-1) {
            if (!this.map[req.y][req.x+1].sel) {
                this.map[req.y][req.x+1].sel = true;
                ret.act = ret.act.concat(this.clickBox({y:req.y, x:req.x+1}).act);
            }
        }
    }
    return ret;
};


module.exports = ms;

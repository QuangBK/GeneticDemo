/**
 * Created by Administrator on 1/3/2016.
 */
var LineDraw = cc.Node.extend({
    sprite:null,
    point1:null,
    point2:null,
    a:0,
    b:0,
    minX:0,
    maxX:0,
    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor:function (a,b,minX, maxX) {
        this._super();
        // init coin animation
        this.sprite = new cc.DrawNode();
        this.sprite.clear();
        this.a = a;
        this.b = b;
        this.minX = minX;
        this.maxX = maxX;
        //cc.p(pos.x -this.size,pos.y - this.size)
        this.point1 = cc.p(minX, a*minX+b);
        this.point2 = cc.p(maxX, a*maxX+b);
        this.sprite.drawSegment(this.point1, this.point2, 2, cc.color.WHITE);
        this.addChild(this.sprite,0);

        this.init();
        //this.scheduleUpdate();
    },
    init:function(){
        //this._super();
        //this.scheduleUpdate();
    },
    removeFromParent:function () {
        this.sprite.removeFromParent();
        this.sprite = null;
    },
    update:function (dt) {
    }
});
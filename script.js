function randomize(maxNum) {
  return Math.floor(Math.random() * (maxNum + 1));
}
var ADJECTIVES = ['Triumphant', 'Flowing', 'Floating', 'Precocious', 'Hornery', 'Flighty', 'Bellicose', 'Arcadian', 'Calamitous', 'Corpulent', 'Effulgent', 'Equanimous', 'Execrable', 'Judicious', 'Meretricious', 'Parsimonious', 'Pendulous', 'Propitious', 'Redolent']
var NOUNS = ['Swan', 'Heroes', 'Dream', 'Fancy', 'Chaos', 'Insanity', 'Thrill', 'Victory', 'Failure', 'Apprehension', 'Anger', 'Joy', 'Delights', 'Turpitude']
var name = ADJECTIVES[randomize(ADJECTIVES.length - 1)] + ' ' + NOUNS[randomize(NOUNS.length - 1)];
var painter;

$(function() {
  $('#name').val(name);

  painter = {
    getCanvas: function() {
      return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    },
    eraseOrColor: function() {
      return this.$eraser.hasClass('erase') ? 'white' : this.fillColor;
    },
    saveToUndo: function() {
      this.undos.push(this.getCanvas());
      if (this.undos.length > 100) this.undos.shift();
    },
    drawShape: function() {
      this.redos = [];
      this.saveToUndo();
      this.ctx.fillStyle = this.eraseOrColor();
      if (this.shape === 'triangle') this.drawTriangle();
      else if (this.shape === 'square') this.drawSquare();
      else if (this.shape === 'circle') this.drawCircle();
    },
    drawTriangle: function() {
      this.ctx.beginPath();
      this.ctx.moveTo(this.x - this.shapeSize, this.y + this.shapeSize);
      this.ctx.lineTo(this.x + this.shapeSize, this.y + this.shapeSize);
      this.ctx.lineTo(this.x, this.y - this.shapeSize);
      this.ctx.lineTo(this.x - this.shapeSize, this.y + this.shapeSize);
      this.ctx.closePath();
      this.ctx.fill();
    },
    drawSquare: function() {
      this.ctx.fillRect(this.x - this.shapeSize, this.y - this.shapeSize, this.shapeSize * 2, this.shapeSize * 2);
    },
    drawCircle: function() {
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, this.shapeSize, 0, 2 * Math.PI);
      this.ctx.closePath();
      this.ctx.fill();
    },
    clearCanvas: function() {
      this.ctx.fillStyle = 'white';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height); 
    },
    undo: function() {
      if (this.undos.length === 0) return;
      else {
        this.redos.push(this.getCanvas());
        this.ctx.putImageData(this.undos.pop(), 0, 0);
      }
    },
    redo: function() {
      if (this.redos.length === 0) return;
      else {
        this.undos.push(this.getCanvas());
        this.ctx.putImageData(this.redos.pop(), 0, 0);
      }
    },
    bindEvents: function() {
      $('#shapes').on('click', 'input', this.handleSelectShape.bind(this));
      $('#clear').click(this.clearCanvas.bind(this));
      this.$colorInput.on('change keyup', this.handleColorInput.bind(this));
      $('#shape_size').on('keyup click', this.handleShapeSize.bind(this));
      $('canvas').on('mousemove', this.handlePenMove.bind(this));
      $('canvas').on('mousedown', this.handlePenDown.bind(this)); 
      $('canvas').on('mouseup mouseleave', this.handlePenUp.bind(this));
      $('#eraser').click(this.handleEraser.bind(this));
      $(document).on('keydown', this.handleUndoRedo.bind(this));
      $('#download').on('click', this.handleDownload.bind(this));
      $('#set_canvas').on('submit', this.handleSetup.bind(this));
    },
    handleSetup: function(e) {
      $('#tint').fadeOut();
      this.canvas.width = $('#width').val();
      this.canvas.height = $('#height').val();
      $('#title').val($('#name').val())
      this.clearCanvas();
    },
    handleSelectShape: function(e) { 
      this.shape = e.target.getAttribute('id');
      $('.active').toggleClass('active');
      e.target.classList += 'active';
    },
    handleColorInput: function(e) { 
      this.fillColor = e.target.value;
    },
    handleShapeSize: function(e) {
      this.shapeSize = +e.target.value;
    },
    handlePenMove: function(e) {
      this.x = e.offsetX;
      this.y = e.offsetY;
      if (this.holdClick) this.drawShape();
    },
    handlePenDown: function() {
      this.drawShape();
      this.holdClick = true;
    },
    handlePenUp: function() {
      this.holdClick = false;
    },
    handleEraser: function(e) {
      $(e.target).toggleClass('erase');
    },
    handleUndoRedo: function(e) {
      if (e.key === 'y') this.redo();
      else if (e.key === 'z') this.undo();
    },
    handleDownload: function(e) {
      e.target.href = this.canvas.toDataURL();
      e.target.download = $('#title').val();
    },
    init: function() {
      this.canvas = document.querySelector('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.$colorInput = $('#color');
      this.$eraser = $('#eraser');

      this.shape = 'square';
      this.fillColor = 'black';
      this.x;
      this.y;
      this.holdClick;
      this.shapeSize = 25;
      this.undos = [];
      this.redos = [];
      this.bindEvents(); 
    },
  }
  painter.init();
});


import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import "./loader.js";
import $ from 'jquery';
import "./script.js";
//import { css, jsx } from '@emotion/react';
//import styled from '@emotion/styled';
import { Button, Slider } from "@material-ui/core";

class App extends React.Component {

  constructor() {
    super();
    this.ctx = null;
    this.canvas = null;
    this.container = null;
    this.state = {
      width: 3,
      color: "#000000",
      paint: false,
      erase: false
    };
  }

  sliderMove = (e, val) => {
    var lwidth = (val / 5) * 2 + 3;
    this.setState({ width: lwidth });
    $("#marker-size").css({ width: lwidth, height: lwidth });
  }

  changeColor = (e) => {
    this.setState({ color: e.target.value });
  }

  handleErase = () => {
    if (this.state.erase) {
      this.setState({ erase: false });
    }
    else {
      this.setState({ erase: true });
    }
  }

  handleReset = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.setState({ width: 3, color: "#000000", erase: false });
  }

  handleSave = () => {
    if (typeof (localStorage) !== null) {
      localStorage.setItem("imgCanvas", this.canvas.toDataURL());
    } else {
      window.alert("Your browser does not support local storage!");
    }
  }

  componentDidUpdate() {

  }

  componentDidMount() {

    var self = this;

    self.canvas = document.getElementById("canvas-container");
    self.container = $("#paint-container");

    self.ctx = self.canvas.getContext("2d");

    var mouse = { x: 0, y: 0 };
    self.ctx.lineWidth = self.state.width;
    self.ctx.lineJoin = "round";
    self.ctx.lineCap = "round";

    if (localStorage.getItem("imgCanvas") !== null) {
      var img = new Image();
      img.onload = function () {
        self.ctx.drawImage(img, 0, 0);
      }
      img.src = localStorage.getItem("imgCanvas");
    }

    self.container.mousedown(function (e) {
      self.setState({ paint: true });
      self.ctx.beginPath();
      mouse.x = e.pageX - this.offsetLeft;
      mouse.y = e.pageY - this.offsetTop;
      self.ctx.moveTo(mouse.x, mouse.y);

      if (!self.state.erase)
        self.ctx.strokeStyle = $("#colorx").val();
      else self.ctx.strokeStyle = "#ffffff";

      self.ctx.lineWidth = self.state.width;
    });

    self.container.mousemove(function (e) {
      if (self.state.paint) {
        if (!self.state.erase)
          self.ctx.strokeStyle = $("#colorx").val();
        else self.ctx.strokeStyle = "#ffffff";
        self.ctx.lineWidth = self.state.width;
        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
        self.ctx.lineTo(mouse.x, mouse.y);
        self.ctx.stroke();
      }

    });

    self.container.mouseup(function (e) {
      self.setState({ paint: false });
    });

    self.container.mouseleave(function (e) {
      self.setState({ paint: false });
    })
  }

  render() {
    return (
      <>
        <div id="controls">
          <div id="color-input">
            <label for="colorx"></label>
            <input type="color" id="colorx" list="colorsxx"
              value={this.state.color}
              onChange={this.changeColor} />
          </div>

          <div id="marker-container">
            <div id="marker-size"
              style={{
                backgroundColor: this.state.color,
                width: this.state.width,
                height: this.state.width
              }}></div>
          </div>

          <div id="sliderContainer">
            <div id="sliderDiv">
              <Slider value={this.state.width === 3 ? 0 : this.state.width * 5 / 2}
                onChange={this.sliderMove} />
            </div>
          </div>
        </div>

        <div id="paint-container">
          <canvas id="canvas-container" width="500px" height="495px"></canvas>
        </div>

        <div id="button_group">
          <button type="button"
            className=
            {
              this.state.erase ?
                "btn bg-light mx-2 text-primary" :
                "btn bg-primary mx-2 text-white"
            }
            onClick={this.handleErase}
          >Erase</button>

          <button type="button"
            className="btn bg-primary mx-2 text-white"
            onClick={this.handleSave}
          >Save</button>

          <button type="button"
            className="btn bg-primary mx-2 text-white"
            onClick={this.handleReset}
          >Reset</button>
        </div>
      </>
    );
  }
}

export default App;
/* No-op stand-ins for the Khamis.AI modules that are not part of this standalone build. */
(function () {
  var noop = function () {};
  window.KhamisSimulation = { init: noop, pause: noop, resume: noop };
  window.KhamisEcosystems = { render: noop };
  window.KhamisMathSkills = { render: noop };
  window.KhamisComplexity = { open: noop, render: noop, pause: noop };
  window.KhamisResources = { render: noop };
  window.KhamisHomeMap = { render: noop };
})();

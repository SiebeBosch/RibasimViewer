import 'package:flutter/material.dart';
import './sidebar_overlays_component.dart'; // Replace with the actual path

class SidebarComponent extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: <Widget>[
          // ... other drawer items ...
          SidebarOverlaysComponent(), // Updated widget reference
        ],
      ),
    );
  }
}

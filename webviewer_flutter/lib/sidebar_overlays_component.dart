import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:webviewer_flutter/main.dart';

class SidebarOverlaysComponent extends StatefulWidget {
  @override
  _SidebarOverlaysComponentState createState() =>
      _SidebarOverlaysComponentState();
}

class _SidebarOverlaysComponentState extends State<SidebarOverlaysComponent> {
  @override
  Widget build(BuildContext context) {
    return CheckboxListTile(
      title: Text('Areas'),
      value: context.watch<AreasProvider>().areas,
      onChanged: (bool? newValue) {
        context.read<AreasProvider>().toggle();
        // Additional actions when the checkbox changes
      },
    );
  }
}

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'map_component.dart';
import 'sidebar_component.dart';

void main() {
  runApp(MultiProvider(
      child: MyApp(),
      providers: [ChangeNotifierProvider(create: (_) => AreasProvider())]));
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: Text('Map with Sidebar'),
        ),
        drawer: SidebarComponent(),
        body: Stack(
          children: [
            MapComponent(),
          ],
        ),
      ),
    );
  }
}

class AreasProvider with ChangeNotifier {
  bool _areas = true;

  bool get areas => _areas;

  void toggle() {
    _areas = !_areas;
    notifyListeners();
  }

  /// Makes `Counter` readable inside the devtools by listing all of its properties
}

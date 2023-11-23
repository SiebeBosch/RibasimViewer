import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        body: Stack(
          children: [
            FlutterMap(
              options: MapOptions(
                initialCenter: LatLng(51.509364, -0.128928),
                initialZoom: 3.2,
              ),
              children: [
                TileLayer(
                  urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                  userAgentPackageName: 'com.example.app',
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class MyHomePage extends StatefulWidget {
  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int selectedMapOption =
      1; // Initialize with a default value, for example, option 1.

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Water Balance Dashboard'),
      ),
      body: Row(
        children: [
          // Side Panel (Left)
          Container(
            width: 300,
            child: SidePanelWidget(
              selectedMapOption:
                  selectedMapOption, // Pass the selected option to the side panel
              onMapOptionChanged: (int value) {
                setState(() {
                  selectedMapOption =
                      value; // Update the selected option when it changes
                });
              },
            ),
          ),
          // Map and Chart (Right)
          Expanded(
            child: MapAndChartWidget(),
          ),
        ],
      ),
    );
  }
}

class SidePanelWidget extends StatelessWidget {
  final int selectedMapOption;
  final ValueChanged<int> onMapOptionChanged;

  SidePanelWidget({
    required this.selectedMapOption,
    required this.onMapOptionChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 300,
      color: Colors.grey[200], // Set a background color for the side panel
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          // Add UI components for background map options and scenario switcher here.
          // For example:
          Text(
            'Background Maps',
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
          RadioListTile(
            title: Text('Map Option 1'),
            value: 1,
            groupValue: selectedMapOption,
            onChanged: (value) {
              onMapOptionChanged(
                  value!); // Use the callback to update the selected option
            },
          ),
          RadioListTile(
            title: Text('Map Option 2'),
            value: 2,
            groupValue: selectedMapOption,
            onChanged: (value) {
              onMapOptionChanged(
                  value!); // Use the callback to update the selected option
            },
          ),
          // Add similar UI components for scenario switcher
        ],
      ),
    );
  }
}

class MapAndChartWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          FlutterMap(
            options: MapOptions(
              center: LatLng(51.509364, -0.128928),
              zoom: 3.2,
            ),
            children: [
              TileLayer(
                urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                userAgentPackageName: 'com.example.app',
              ),
            ],
          ),
        ],
      ),
    );
  }
}
